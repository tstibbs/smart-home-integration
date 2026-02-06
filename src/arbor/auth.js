import axios from 'axios'

import {request} from '../restUtils.js'

class Authenticator {
	#persistedCookies

	invalidateCookies() {
		this.#persistedCookies = null
	}

	async auth(username, password, school) {
		if (this.#persistedCookies == null) {
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
				this.#persistedCookies = cookies.join('; ')
			} else {
				console.error('auth failed, no set-cookie headers in response')
			}
		}
		return this.#persistedCookies
	}
}

export const authenticator = new Authenticator()
