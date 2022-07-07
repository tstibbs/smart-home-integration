import {Duration, Stack, Fn} from 'aws-cdk-lib'
import {NodejsFunction} from 'aws-cdk-lib/aws-lambda-nodejs'
import {Runtime} from 'aws-cdk-lib/aws-lambda'
import {LambdaRestApi, CfnAccount} from 'aws-cdk-lib/aws-apigateway'
import {APP_ID} from './deploy-envs.js'

import {applyStandardTags} from '@tstibbs/cloud-core-utils'
import {addUsageTrackingToRestApi, apiGatewayCloudwatchRoleRef} from '@tstibbs/cloud-core-utils/src/stacks/usage-tracking.js'

class DeployStack extends Stack {
	constructor(scope, id, props) {
		super(scope, id, props)

		new CfnAccount(this, 'agiGatewayAccount', {
			//use a centrally created role so that it doesn't get deleted when this stack is torn down
			cloudWatchRoleArn: Fn.importValue(apiGatewayCloudwatchRoleRef)
		})

		const webBackEndFunction = new NodejsFunction(this, 'webBackEndFunction', {
			entry: 'src/app.js',
			environment: {
				APP_ID
			},
			memorySize: 128,
			timeout: Duration.seconds(29), //API Gateway timeout is 29 seconds
			runtime: Runtime.NODEJS_16_X
		})

		const webBackEndInterfaceApi = new LambdaRestApi(this, 'webBackEndInterfaceApi', {
			handler: webBackEndFunction,
			deployOptions: {
				methodOptions: {
					'/*/*': {
						throttlingRateLimit: 10,
						throttlingBurstLimit: 100
					}
				}
			},
			cloudWatchRole: false
		})
		addUsageTrackingToRestApi(webBackEndInterfaceApi)

		applyStandardTags(this)
	}
}

export {DeployStack}
