import {strictEqual} from 'assert'
import {validate} from '@tstibbs/cloud-core-utils'

import dist from '../dist/main.js'

//just check it imports, relatively little value in testing it properly
import '../deploy/deploy-stack.mjs'

async function run() {
	try {
		//check it exposes a function, that's all we can do without proper unit tests
		strictEqual(typeof dist.handler, 'function')

		//validate cf script
		await validate('deploy/template.yml')
	} catch (e) {
		console.error(e)
		process.exit(1)
	}
}

run()
