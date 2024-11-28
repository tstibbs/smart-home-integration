import axios from 'axios'

import {request} from '../restUtils.js'
import {auth} from './auth.js'

export async function fetchMealBalance(username, password, school, studentId) {
	console.log({school, studentId})
	let cookies = await auth(username, password, school)
	let {data} = await fetchData(cookies, school, studentId)
	return getMealBalance(data)
}

async function fetchData(cookies, school, studentId) {
	let url = `https://${school}.arbor.sc/guardians/home-ui/dashboard/student-id/${studentId}?format=javascript`
	return await request(() =>
		axios.get(url, {
			headers: {
				Cookie: cookies
			}
		})
	)
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
