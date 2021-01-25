import modofun from 'modofun'

import {post} from './utils.js'
import {checkArm} from './blink/checkArm.js'
import {isAWS} from './envs.js'

const handleBlinkCheckArm = post(
	async (req, res) => {
		try {
			let armed = await checkArm(req.body.email, req.body.password)
			res.json(armed)
		} catch (e) {
			if (Number.isInteger(e.status)) {
				res.status(e.status).end()
			} else {
				console.error(e) // log because thrown errors don't always get printed if they cause an unhandled promise rejection
				res.status(500).end()
			}
		}
	}
)

let router = modofun(
	{
		blinkCheckArm: handleBlinkCheckArm
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
