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
	const cookies = await authenticator.auth(username, password, school)
	const url = `https://${school}.arbor.sc/guardians/${path}?format=javascript`
	const {data} = await request(async () => {
		try {
			return await axios.get(url, {
				headers: {
					Cookie: cookies
				}
			})
		} catch (e) {
			if (e.response.status == 401) {
				authenticator.invalidateCookies()
				return await axios.get(url, {
					headers: {
						Cookie: cookies
					}
				})
			} else {
				throw e
			}
		}
	})
	return data
}
