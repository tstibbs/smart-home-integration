import {deploy, loadEnvs, ifCmd} from '@tstibbs/cloud-core-utils'

const stackName = 'smart-home-integration'
const templatePath = './deploy/template.yml'
const capabilities = ['CAPABILITY_NAMED_IAM']
const artifacts = {
	'web-back-end': {
		file: './dist/function.zip',
		versionParameterToInject: 'CodeVersionWebBackEnd'
	}
}
const {cfServiceRole, AppId} = loadEnvs({
	APP_ID: 'AppId',
	CF_ROLE_ARN: 'cfServiceRole' //e.g. arn:aws:iam::123456789:role/role-name'
})

async function run() {
	await deploy(stackName, templatePath, capabilities, cfServiceRole, artifacts, {AppId})
}

ifCmd(import.meta, run)
