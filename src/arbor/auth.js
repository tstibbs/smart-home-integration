import {request, axiosInstance} from '../restUtils.js'

class Authenticator {
	#persistedCookies

	invalidateCookies() {
		this.#persistedCookies = null
	}

	//only for tests, to bypass the auth requirement
	setInitialCookieValue(value) {
		this.#persistedCookies = value
	}

	async auth(username, password, school) {
		if (this.#persistedCookies == null) {
			console.log('no persisted cookies, authenticating')
			let response = await request(() =>
				axiosInstance.post(`https://${school}.arbor.sc/auth/login`, {
					items: [
						{
							username: username,
							password: password
						}
					]
				})
			)
			console.log(response.status)
			console.log(response.headers)
			console.log(response.data)
			let cookieHeaders = response.headers['set-cookie']
			if (cookieHeaders == null) {
				console.error('auth failed, no set-cookie headers in response')
			} else {
				let cookies = cookieHeaders.map(header => header.split(';')[0])
				this.#persistedCookies = cookies.join('; ')
				if (!cookies.some(header => header.startsWith('mis='))) {
					console.error('auth possibly failed, no mis cookie in response')
				}
			}
		} else {
			console.log('already have persisted cookies, not re-authenticating')
		}
		return this.#persistedCookies
	}
}

export const authenticator = new Authenticator()
