import { createAction } from 'redux-actions'
import * as constants from 'store/ducks/subscriptions/constants'

export const subscriptionsMainRequest = createAction(constants.SUBSCRIPTIONS_MAIN_REQUEST)
export const subscriptionsMainSuccess = createAction(constants.SUBSCRIPTIONS_MAIN_SUCCESS)
export const subscriptionsMainFailure = createAction(constants.SUBSCRIPTIONS_MAIN_FAILURE)
export const subscriptionsMainIdle = createAction(constants.SUBSCRIPTIONS_MAIN_IDLE)

export const subscriptionsPollRequest = createAction(constants.SUBSCRIPTIONS_POLL_REQUEST)
export const subscriptionsPollSuccess = createAction(constants.SUBSCRIPTIONS_POLL_SUCCESS)
export const subscriptionsPollFailure = createAction(constants.SUBSCRIPTIONS_POLL_FAILURE)
export const subscriptionsPollIdle = createAction(constants.SUBSCRIPTIONS_POLL_IDLE)
