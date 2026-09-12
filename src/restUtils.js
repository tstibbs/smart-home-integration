import axios from 'axios'
import https from 'node:https'

export async function request(delegate) {
	try {
		return await delegate()
	} catch (e) {
		if (e.response && e.response.headers && e.response.data) {
			console.error(e.response.status)
			console.error(e.response.statusText)
			console.error(e.response.headers)
			console.error(e.response.data)
			let error = new Error()
			error.status = parseInt(e.response.status)
			throw error
		} else {
			throw e
		}
	}
}

// make axios look a bit more like a browser
export const axiosInstance = axios.create({
	// Basic settings
	timeout: 15000,
	maxRedirects: 5,
	withCredentials: true, // Auto-send cookies
	decompress: true, // Handles gzip, deflate, brotli automatically

	// HTTP/2 protocol support (experimental in Node.js runtime)
	httpVersion: 2,
	http2Options: {
		sessionTimeout: 5000 // Keeps the underlying HTTP/2 multiplexed stream open
	},

	// TLS & Network Agent adjustments
	httpsAgent: new https.Agent({
		keepAlive: true, // Browsers reuse TCP/TLS connections
		keepAliveMsecs: 1000,
		maxSockets: 100, // Browsers open up to 6 connection streams per domain
		rejectUnauthorized: true
	})
})
