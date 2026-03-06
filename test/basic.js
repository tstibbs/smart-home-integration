import {validateCdkAssets} from '@tstibbs/cloud-core-utils'
import {buildStack} from '../lib/deploy-utils.js'

await validateCdkAssets(buildStack, 1)
