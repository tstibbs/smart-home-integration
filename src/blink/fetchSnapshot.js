import {authedRequest, login} from './authUtils.js'

const MINUTE_IN_MILLIS = 1 * 60 * 1000

async function fetchSnapshot(email, password, network, camera) {
	const cachedAuth = await login(email, password)
	let startDate = encodeURIComponent(new Date(Date.now() - MINUTE_IN_MILLIS).toISOString())
	let data = await authedRequest(
		(accountId, tier) =>
			`https://rest-${tier}.immedia-semi.com/api/v1/accounts/${accountId}/media/changed?since=${startDate}`,
		cachedAuth
	)
	let videos = data.media
	if (network) {
		videos = videos.filter(video => video.network_name == network)
	}
	if (camera) {
		videos = videos.filter(video => video.device_name == camera)
	}
	if (videos.length == 0) {
		let error = new Error('No videos found within the last minute')
		error.status = 404
		throw error
	} else {
		let latest = videos.sort((a, b) => new Date(b.updated_at) - new Date(a.updated_at))[0]
		console.log(latest)
		let thumbnail = await authedRequest(
			(accountId, tier) => `https://rest-${tier}.immedia-semi.com${latest.thumbnail}`,
			cachedAuth,
			{responseType: 'arraybuffer'}
		)
		return 'data:image/jpeg;base64,' + thumbnail.toString('base64')
	}
}

export {fetchSnapshot}
