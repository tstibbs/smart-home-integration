//just a wrapper to allow running this locally in dev - but app.js is what you'd really use in the serverless function

import express from 'express'
import bodyParser from 'body-parser'
import {validateCdkAssets} from '@tstibbs/cloud-core-utils'
import {handler} from '../src/app.js'

let builtHandlers = await validateCdkAssets('smart-home-integration', 1)
let builtHandler = builtHandlers[0]

const router = process.env.LOAD_HANDLER_FROM_CDK != null ? builtHandler : handler

const app = express()
const port = 3001

app.use(bodyParser.json())
app.get('/*', router)
app.post('/*', router)
app.options('/*', router)

app.listen(port, () => console.log(`Test harness listening on http://localhost:${port}.`))
