import {authedRequest, login} from './authUtils.js'

async function fetchData(email, password) {
	const cachedAuth = await login(email, password)
	let data = await authedRequest(
		(accountId, tier) => `https://rest-${tier}.immedia-semi.com/api/v3/accounts/${accountId}/homescreen`,
		cachedAuth
	)
	return data
}

async function getTemperature(cameraNames, email, password) {
	let data = await fetchData(email, password)
	//cameras measure in farenheight
	let tempsF = data.cameras.filter(camera => cameraNames.includes(camera.name)).map(camera => camera.signals.temp)
	let averageTempF = tempsF.reduce((prev, curr) => prev + curr) / tempsF.length
	let averageTempC = Math.round((averageTempF - 32) * (5 / 9))
	return averageTempC
}

export {getTemperature}
