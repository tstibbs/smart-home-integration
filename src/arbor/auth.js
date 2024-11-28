import axios from 'axios'

import {request} from '../restUtils.js'

export async function auth(username, password, school) {
	let response = await request(() =>
		axios.post(`https://${school}.arbor.sc/auth/login`, {
			items: [
				{
					username: username,
					password: password
				}
			]
		})
	)
	let cookieHeaders = response.headers['set-cookie']
	if (cookieHeaders != null) {
		let cookies = cookieHeaders.filter(header => header.startsWith('mis=')).map(header => header.split(';')[0])
		return cookies.join('; ')
	} else {
		console.error('auth failed, no set-cookie headers in response')
	}
}
