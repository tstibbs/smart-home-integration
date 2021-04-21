import axios from 'axios'

import {appId} from '../envs.js'
import {request} from './restUtils.js'

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

export async function authedRequest(urlBuilder, cachedAuth, options = {}) {
	const {accountId, authToken, tier} = cachedAuth
	const axiosInstance = axios.create({
		headers: {'token-auth': authToken},
		...options
	})

	let response = await request(async () => await axiosInstance.get(urlBuilder(accountId, tier)))
	return response.data
}
