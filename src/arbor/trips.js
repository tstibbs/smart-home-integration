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
		const amountString = amounts.length == 1 ? amounts[0] : `Error, unexpected number of amounts: ${amounts.join(';')}`
		outstanding.push([name, amountString])
	}
	return {
		data: outstanding
	}
}
