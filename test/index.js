//just a wrapper to allow running this locally in dev - but app.js is what you'd really use in the serverless function

import express from 'express'
import bodyParser from 'body-parser'
import {validateCdkAssets} from '@tstibbs/cloud-core-utils'

let handlers = await validateCdkAssets('smart-home-integration', 1)

const router = handlers[0]

const app = express()
const port = 3001

app.use(bodyParser.json())
app.get('/*', router)
app.post('/*', router)
app.options('/*', router)

app.listen(port, () => console.log(`Test harness listening on http://localhost:${port}.`))
