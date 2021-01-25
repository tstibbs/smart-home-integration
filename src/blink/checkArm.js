import axios from 'axios'

import {login} from './login.js'
import {request} from './restUtils.js'

async function checkArm(email, password) {
	let {accountId, authToken, tier} = await login(email, password)
	const axiosInstance = axios.create({
		headers: {'token-auth': authToken}
	});

	let response = await request(async () => await axiosInstance.get(`https://rest-${tier}.immedia-semi.com/api/v3/accounts/${accountId}/homescreen`))

	let armed = response.data.networks.every(network => network.armed === true)
	return armed
}

export {checkArm}
