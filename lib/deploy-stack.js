import cdk from '@aws-cdk/core'
import nodejsLambda from '@aws-cdk/aws-lambda-nodejs'
import lambda from '@aws-cdk/aws-lambda'
import apig from '@aws-cdk/aws-apigateway'
import {APP_ID} from './deploy-envs.js'

class DeployStack extends cdk.Stack {
	constructor(scope, id, props) {
		super(scope, id, props)

		const backend = new nodejsLambda.NodejsFunction(this, 'WebBackEndFunction', {
			entry: 'src/app.js',
			environment: {
				APP_ID
			},
			memorySize: 128,
			timeout: cdk.Duration.seconds(20),
			runtime: lambda.Runtime.NODEJS_14_X
		})

		new apig.LambdaRestApi(this, 'WebBackEndInterfaceApi', {
			handler: backend,
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
	}
}

export {DeployStack}
