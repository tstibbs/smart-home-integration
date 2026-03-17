import {findMatches, fetch} from './utils.js'

export async function fetchOutstandingTripPayments(username, password, school, studentId) {
	const data = await fetch(username, password, school, `trip-ui/dashboard/student-id/${studentId}`)
	const findTrips = header =>
		data.content
			.flatMap(content => content.content.filter(innerContent => innerContent.props.title.includes(header)))
			.flatMap(section => section.content ?? [])
			.map(content => [content.props.fieldLabel, content.props.url])
	let upcomingTrips = findTrips('Upcoming Trips')
	let availableTrips = findTrips('Trips Open to ')
	console.log({upcomingTrips})
	console.log({availableTrips})
	const fetchAmount = async trips => {
		const outstanding = []
		for (const [name, url] of trips) {
			if (!url.startsWith('/guardians/')) {
				throw new Error(`${url} is not a valid url`)
			}
			const sanitizedUrl = url.replace(/^\/guardians\//, '')
			const tripData = await fetch(username, password, school, sanitizedUrl)
			const amounts = findMatches(tripData, node => node.props?.fieldLabel == 'Amount outstanding').map(
				node => node.props?.value
			)
			if (amounts.length == 1) {
				if (amounts[0] == '£0.00' || amounts[0] == '0.00' || amounts[0] == '0') {
					console.log(`Amount appears to be zero, ignoring '${amounts[0]}' for ${name}`)
				} else {
					outstanding.push([name, amounts[0]])
				}
			} else if (amounts.length == 0) {
				console.log(`Ignoring entry with no outstanding amount: ${name}`)
			} else {
				outstanding.push([name, `Error, unexpected number of amounts: ${amounts.join(';')}`])
			}
		}
		return outstanding
	}
	const optionalOutstanding = (await fetchAmount(availableTrips)).map(([name, amount]) => [
		`(optional) ${name}`,
		amount
	])
	const outstanding = await fetchAmount(upcomingTrips)
	return {
		data: [...outstanding, ...optionalOutstanding]
	}
}
