import {Duration, Stack} from 'aws-cdk-lib'
import {NodejsFunction} from 'aws-cdk-lib/aws-lambda-nodejs'
import {Runtime} from 'aws-cdk-lib/aws-lambda'
import {LambdaRestApi} from 'aws-cdk-lib/aws-apigateway'
import {APP_ID} from './deploy-envs.js'

import {applyStandardTags} from '@tstibbs/cloud-core-utils'

class DeployStack extends Stack {
	constructor(scope, id, props) {
		super(scope, id, props)

		const webBackEndFunction = new NodejsFunction(this, 'webBackEndFunction', {
			entry: 'src/app.js',
			environment: {
				APP_ID
			},
			memorySize: 128,
			timeout: Duration.seconds(29), //API Gateway timeout is 29 seconds
			runtime: Runtime.NODEJS_16_X
		})

		new LambdaRestApi(this, 'webBackEndInterfaceApi', {
			handler: webBackEndFunction,
			deployOptions: {
				methodOptions: {
					'/*/*': {
						throttlingRateLimit: 1,
						throttlingBurstLimit: 1
					}
				}
			},
			cloudWatchRole: false
		})

		applyStandardTags(this)
	}
}

export {DeployStack}
