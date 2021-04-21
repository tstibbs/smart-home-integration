import {authedRequest, login} from './authUtils.js'

async function fetchData(email, password) {
	const cachedAuth = await login(email, password)
	let data = await authedRequest(
		(accountId, tier) => `https://rest-${tier}.immedia-semi.com/api/v3/accounts/${accountId}/homescreen`,
		cachedAuth
	)
	return data
}

async function checkArmed(email, password) {
	let data = await fetchData(email, password)
	let armed = data.networks.every(network => network.armed === true)
	return armed
}

async function checkAllArmed(email, password) {
	let data = await fetchData(email, password)
	let networksAllArmed = data.networks.every(network => network.armed === true)
	let camerasAllArmed = data.cameras.every(camera => camera.enabled === true)
	return networksAllArmed && camerasAllArmed
}

export {checkArmed, checkAllArmed}
