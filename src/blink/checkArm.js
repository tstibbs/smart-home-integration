import {authedRequest, login} from './authUtils.js'

async function fetchData(email, password, cachedAuth) {
	if (cachedAuth == null) {
		cachedAuth = await login(email, password)
	}
	let data = await authedRequest(`/api/v3/accounts/${cachedAuth.accountId}/homescreen`, cachedAuth)
	return data
}

async function fetchArmStatus(email, password, cachedAuth) {
	let data = await fetchData(email, password, cachedAuth)
	let disarmedNetworks = data.networks.filter(network => network.armed !== true).map(network => network.id)
	let disarmedCameras = data.cameras
		.filter(camera => camera.enabled !== true)
		.map(camera => ({networkId: camera.network_id, cameraId: camera.id}))
	return {
		disarmedNetworks,
		disarmedCameras
	}
}

async function checkArmed(email, password) {
	let {disarmedNetworks} = await fetchArmStatus(email, password)
	return disarmedNetworks.length === 0
}

async function checkAllArmed(email, password) {
	let {disarmedNetworks, disarmedCameras} = await fetchArmStatus(email, password)
	return disarmedNetworks.length === 0 && disarmedCameras.length === 0
}

export {fetchArmStatus, checkArmed, checkAllArmed}
