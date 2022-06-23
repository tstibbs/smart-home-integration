import backOff from 'exponential-backoff'
import {authedRequest, login} from './authUtils.js'
import {fetchArmStatus} from './checkArm.js'

async function armAll(email, password) {
	const cachedAuth = await login(email, password)
	const {disarmedNetworks, disarmedCameras} = await fetchArmStatus(email, password, cachedAuth)
	//enable all networks first
	for (let networkId of disarmedNetworks) {
		await makeCommand(
			cachedAuth,
			networkId,
			`/api/v1/accounts/${cachedAuth.accountId}/networks/${networkId}/state/arm`,
			response => response.commands.map(command => command.id)
		)
	}
	//then enable all cameras
	for (let camera of disarmedCameras) {
		await makeCommand(
			cachedAuth,
			camera.networkId,
			`/network/${camera.networkId}/camera/${camera.cameraId}/enable`,
			response => [response.id]
		)
	}
}

async function makeCommand(cachedAuth, networkId, path, commandIdExtractor) {
	let response = await authedRequest(path, cachedAuth, {
		method: 'post'
	})
	console.log(response)
	await waitForCommandsComplete(cachedAuth, networkId, commandIdExtractor(response))
}

async function waitForCommandsComplete(cachedAuth, networkId, commandIds) {
	//really just using backOff to simplify the execution flow - no real need for _increasing_ backoff here
	await backOff.backOff(
		async () => {
			for (let commandId of commandIds.slice(0)) {
				//slice copies the array allowing us to modify the underlying array later
				let response = await authedRequest(`/network/${networkId}/command/${commandId}`, cachedAuth)
				console.log(`${commandId}=${response.complete}`)
				if (response.complete == true) {
					let index = commandIds.indexOf(commandId)
					if (index != -1) {
						//remove it so we don't check this again next time
						commandIds.splice(index, 1)
					}
				}
			}
			if (commandIds.length > 0) {
				//throw error to make the backoff module try again
				throw new Error(commandIds.join(', '))
			}
		},
		{
			//make first request immediately, then wait .5s, then wait 1s, then wait 2s repeatedly up to a minute.
			startingDelay: 500,
			maxDelay: 2000, //two seconds
			numOfAttempts: 32 //try for approx 1 minute before giving up
		}
	)
}

export {armAll}
