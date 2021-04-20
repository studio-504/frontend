import { createAction } from 'redux-actions'
import { createFailureAction } from 'store/errors'
import * as constants from 'store/ducks/push/constants'

/**
 *
 */
export const pushSetApnsTokenRequest = createAction(constants.PUSH_SET_APNS_TOKEN_REQUEST)
export const pushSetApnsTokenSuccess = createAction(constants.PUSH_SET_APNS_TOKEN_SUCCESS)
export const pushSetApnsTokenFailure = createFailureAction(constants.PUSH_SET_APNS_TOKEN_FAILURE)
