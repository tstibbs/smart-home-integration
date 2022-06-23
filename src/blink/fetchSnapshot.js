import backOff from 'exponential-backoff'
import {authedRequest, login} from './authUtils.js'

const MINUTE_IN_MILLIS = 1 * 60 * 1000

async function doFetchSnapshot(cachedAuth, startDate, network, camera) {
	console.log(Date.now())
	let data = await authedRequest(
		`/api/v1/accounts/${cachedAuth.accountId}/media/changed?since=${startDate}`,
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
		let thumbnail = await authedRequest(`${latest.thumbnail}`, cachedAuth, {responseType: 'arraybuffer'})
		return 'data:image/jpeg;base64,' + thumbnail.toString('base64')
	}
}

async function fetchSnapshot(email, password, network, camera) {
	const cachedAuth = await login(email, password)
	let startDate = encodeURIComponent(new Date(Date.now() - MINUTE_IN_MILLIS).toISOString())

	//next line will re-throw the error thrown by doFetchSnapshot if the retries are exceeded
	let response = await backOff.backOff(() => doFetchSnapshot(cachedAuth, startDate, network, camera), {
		//the following two numbers are chosen to try to get 5 requests into the 29-second api-gateway limit
		numOfAttempts: 5,
		startingDelay: 1500
	})
	return response
}

export {fetchSnapshot}
