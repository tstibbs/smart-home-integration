//just a wrapper to allow running this locally in dev - but app.js is what you'd really use in the serverless function

import express from 'express'
import bodyParser from 'body-parser'
import {validateCdkAssets} from '@tstibbs/cloud-core-utils'

import {buildStack} from '../lib/deploy-utils.js'
import {handler} from '../src/app.js'

async function loadHandler() {
	if (process.env.LOAD_HANDLER_FROM_CDK != null) {
		const builtHandlers = await validateCdkAssets(buildStack, 1)
		return builtHandlers[0]
	} else {
		return handler
	}
}

const router = await loadHandler()
const app = express()
const port = 3001

app.use(bodyParser.json())
app.get('/*splat', router)
app.post('/*splat', router)
app.options('/*splat', router)

app.listen(port, () => console.log(`Test harness listening on http://localhost:${port}.`))
