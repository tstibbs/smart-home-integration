//just a wrapper to allow running this locally in dev - but app.js is what you'd really use in the serverless function

const express = require('express')
const bodyParser = require('body-parser')

const router = require('../dist/main.js').handler

const app = express()
const port = 3001

app.use(bodyParser.json())
app.get('/*', router)
app.post('/*', router)
app.options('/*', router)

app.listen(port, () => console.log(`Test harness listening on http://localhost:${port}.`))
