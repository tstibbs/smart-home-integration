import modofun from 'modofun'

import {post} from './utils.js'
import {checkArmed, checkAllArmed} from './blink/checkArm.js'
import {armAll} from './blink/arm.js'
import {getTemperature} from './blink/environment.js'
import {fetchSnapshot} from './blink/fetchSnapshot.js'
import {isAWS} from './envs.js'

const wrapper = delegate => {
	return async (req, res) => {
		try {
			let result = await delegate(req.body, res)
			res.json(result)
		} catch (e) {
			if (Number.isInteger(e.status)) {
				res.status(e.status)
				if (e.message) {
					res.send(e.message)
				}
				res.end()
			} else {
				console.error(e) // log because thrown errors don't always get printed if they cause an unhandled promise rejection
				res.status(500).end()
			}
		}
	}
}

const handleBlinkCheckArmed = post(
	wrapper(async (body, res) => {
		let result = await checkArmed(body.email, body.password)
		res.json(result)
	})
)

const handleBlinkCheckAllArmed = post(
	wrapper(async (body, res) => {
		let result = await checkAllArmed(body.email, body.password)
		res.json(result)
	})
)

const handleBlinkArmAll = post(
	wrapper(async (body, res) => {
		let result = await armAll(body.email, body.password)
		res.json(result)
	})
)

const handleFetchSnapshot = post(
	wrapper(async (body, res) => {
		let result = await fetchSnapshot(body.email, body.password, body.network, body.camera)
		res.send(result)
	})
)

const handleBlinkGetTemperature = post(
	wrapper(async (body, res) => {
		let result = await getTemperature(body.cameras, body.email, body.password)
		res.json(result)
	})
)

let router = modofun(
	{
		blinkCheckArmed: handleBlinkCheckArmed,
		blinkCheckAllArmed: handleBlinkCheckAllArmed,
		blinkArmAll: handleBlinkArmAll,
		blinkGetTemperature: handleBlinkGetTemperature,
		fetchSnapshot: handleFetchSnapshot
	},
	{
		mode: 'reqres'
	}
)

let handler = router

if (isAWS) {
	let wrap = (description, delegate) => {
		return (...args) => {
			console.log(`${description}:\n${JSON.stringify(args, null, 2)}`)
			delegate(...args)
		}
	}
	handler = (event, context, callback) => {
		router(event, context, wrap('Modofun returning', callback))
		return
	}
}

export {handler}
