import modofun from 'modofun'

import {post} from './utils.js'
import {checkArmed, checkAllArmed} from './blink/checkArm.js'
import {isAWS} from './envs.js'

const wrapper = delegate => {
	return async (req, res) => {
		try {
			let result = await delegate(req.body)
			res.json(result)
		} catch (e) {
			if (Number.isInteger(e.status)) {
				res.status(e.status).end()
			} else {
				console.error(e) // log because thrown errors don't always get printed if they cause an unhandled promise rejection
				res.status(500).end()
			}
		}
	}
}

const handleBlinkCheckArmed = post(
	wrapper(async body => {
		return await checkArmed(body.email, body.password)
	})
)

const handleBlinkCheckAllArmed = post(
	wrapper(async body => {
		return await checkAllArmed(body.email, body.password)
	})
)

let router = modofun(
	{
		blinkCheckArmed: handleBlinkCheckArmed,
		blinkCheckAllArmed: handleBlinkCheckAllArmed
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
