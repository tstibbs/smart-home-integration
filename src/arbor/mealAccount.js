import {fetch} from './utils.js'

export async function fetchMealBalance(username, password, school, studentId) {
	console.log({school, studentId})
	const data = await fetch(username, password, school, `customer-account-ui/active-payments/student-id/${studentId}`)
	return getMealBalance(data)
}

function getMealBalance(data) {
	console.log(JSON.stringify(data))
	let balanceDescription = data.content
		.map(ct => ct.content)
		.flat()
		.filter(ct => ct?.props?.title?.trim() == 'Active Payments')
		.map(ct => ct?.content)
		.flat()
		.find(ct => ct?.props?.fieldLabel == 'Meals').props.value
	let regexMatches = /(-?)£(\d+\.\d+)/.exec(balanceDescription)
	let balanceStr = regexMatches[1] + regexMatches[2]
	let balance = parseFloat(balanceStr)
	console.log(balance)
	return balance
}
