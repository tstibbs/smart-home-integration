import dotenv from 'dotenv'
dotenv.config()

export const appId = process.env.APP_ID

export const isAWS = process.env.AWS_LAMBDA_FUNCTION_NAME != undefined
