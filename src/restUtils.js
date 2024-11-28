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
