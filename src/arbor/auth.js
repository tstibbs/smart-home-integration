import axios from 'axios'

import {request} from '../restUtils.js'

class Authenticator {
	#persistedCookies

	invalidateCookies() {
		this.#persistedCookies = null
	}

	async auth(username, password, school) {
		if (this.#persistedCookies == null) {
			console.log('no persisted cookies, authenticating')
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
			console.log(response.status)
			let cookieHeaders = response.headers['set-cookie']
			if (cookieHeaders != null) {
				let cookies = cookieHeaders.filter(header => header.startsWith('mis=')).map(header => header.split(';')[0])
				this.#persistedCookies = cookies.join('; ')
			} else {
				console.error('auth failed, no set-cookie headers in response')
			}
		} else {
			console.log('already have persisted cookies, not re-authenticating')
		}
		return this.#persistedCookies
	}
}

export const authenticator = new Authenticator()
