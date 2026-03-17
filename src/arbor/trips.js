import {findMatches, fetch} from './utils.js'

export async function fetchOutstandingTripPayments(username, password, school, studentId) {
	const data = await fetch(username, password, school, `trip-ui/dashboard/student-id/${studentId}`)
	let trips = data.content
		.flatMap(content => content.content.filter(innerContent => innerContent.props.title.includes('Upcoming Trips')))
		.flatMap(section => section.content)
		.map(content => [content.props.fieldLabel, content.props.url])

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
				console.log(`Amount appears to be zero, ignoring: ${amounts[0]}`)
			} else {
				outstanding.push([name, amounts[0]])
			}
		} else {
			outstanding.push([name, `Error, unexpected number of amounts: ${amounts.join(';')}`])
		}
	}
	return {
		data: outstanding
	}
}
