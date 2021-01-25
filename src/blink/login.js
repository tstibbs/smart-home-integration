import axios from 'axios'

import {appId} from '../envs.js'
import {request} from './restUtils.js'

const axiosInstance = axios.create()

async function login(email, password) {
	let postData = {
		"unique_id": appId,
		"email": email,
		"password": password
	}

	let response = await request(async () => await axiosInstance.post('https://rest-prod.immedia-semi.com/api/v4/account/login', postData))

	return {
		accountId: response.data.account.id,
		authToken: response.data.authtoken.authtoken,
		tier: response.data.region.tier
	}
}

export {login}
