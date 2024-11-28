import axios from 'axios'

import {appId} from '../envs.js'
import {request} from '../restUtils.js'

const axiosInstance = axios.create()

export async function login(email, password) {
	let postData = {
		unique_id: appId,
		email: email,
		password: password,
		reauth: true
	}

	let response = await request(
		async () => await axiosInstance.post('https://rest-prod.immedia-semi.com/api/v5/account/login', postData)
	)

	return {
		accountId: response.data.account.account_id,
		authToken: response.data.auth.token,
		tier: response.data.account.tier
	}
}

export async function authedRequest(path, cachedAuth, options = {}) {
	const {authToken, tier} = cachedAuth
	let url = `https://rest-${tier}.immedia-semi.com${path}`
	let config = {
		url,
		headers: {'token-auth': authToken},
		...options
	}
	let response = await request(async () => await axiosInstance.request(config))
	return response.data
}
