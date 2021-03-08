import axios from 'axios'

import {login} from './login.js'
import {request} from './restUtils.js'

async function doRequest(email, password) {
	let {accountId, authToken, tier} = await login(email, password)
	const axiosInstance = axios.create({
		headers: {'token-auth': authToken}
	});

	let response = await request(async () => await axiosInstance.get(`https://rest-${tier}.immedia-semi.com/api/v3/accounts/${accountId}/homescreen`))
	return response.data
}

async function checkArmed(email, password) {
	let data = await doRequest(email, password)
	let armed = data.networks.every(network => network.armed === true)
	return armed
}

async function checkAllArmed(email, password) {
	let data = await doRequest(email, password)
	let networksAllArmed = data.networks.every(network => network.armed === true)
	let camerasAllArmed = data.cameras.every(camera => camera.enabled === true)
	return networksAllArmed && camerasAllArmed
}

export {checkArmed, checkAllArmed}
