import axios from 'axios'

import {authenticator} from './auth.js'
import {request} from '../restUtils.js'

export function findMatches(node, predicate) {
	if (node != null) {
		if (predicate(node)) {
			return [node]
		} else if (Array.isArray(node.content)) {
			return node.content.flatMap(content => findMatches(content, predicate))
		}
	}
	return []
}

export async function fetch(username, password, school, path) {
	const url = `https://${school}.arbor.sc/guardians/${path}?format=javascript`
	const doOneRequest = async () => {
		console.log(url)
		const cookies = await authenticator.auth(username, password, school)
		return await axios.get(url, {
			headers: {
				Cookie: cookies
			}
		})
	}
	const {data} = await request(async () => {
		try {
			return await doOneRequest()
		} catch (e) {
			if (e.response.status == 401 || e.response.status == 403) {
				//arbor returns 403 to mean "auth failed"
				console.error('Request failed with 401, re-authing.')
				authenticator.invalidateCookies()
				return await doOneRequest()
			} else {
				throw e
			}
		}
	})
	return data
}
