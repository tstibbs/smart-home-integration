import {fetch} from './utils.js'

export async function fetchMealBalance(username, password, school, studentId) {
	console.log({school, studentId})
	const data = await fetch(username, password, school, `home-ui/dashboard/student-id/${studentId}`)
	return getMealBalance(data)
}

function getMealBalance(data) {
	console.log(JSON.stringify(data))
	let balanceDescription = data.content
		.map(ct => ct.content)
		.flat()
		.filter(ct => ct?.props?.title?.trim() == 'Accounts')
		.map(ct => ct?.content)
		.flat()
		.find(ct => ct?.props?.value?.includes('Meals') && ct?.props?.description?.includes('Balance')).props.description
	let regexMatches = /Balance: £(\d+|\d+\.\d+)$/.exec(balanceDescription)
	let balanceStr = regexMatches[1]
	let balance = parseFloat(balanceStr)
	console.log(balance)
	return balance
}
