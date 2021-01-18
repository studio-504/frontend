import { createAction } from 'redux-actions'
import * as constants from 'store/ducks/subscriptions/constants'

export const subscriptionsMainRequest = createAction(constants.SUBSCRIPTIONS_MAIN_REQUEST)
export const subscriptionsMainIdle = createAction(constants.SUBSCRIPTIONS_MAIN_IDLE)

export const subscriptionsPollRequest = createAction(constants.SUBSCRIPTIONS_POLL_REQUEST)
export const subscriptionsPollIdle = createAction(constants.SUBSCRIPTIONS_POLL_IDLE)

export const subscriptionsPostCompleted = createAction(constants.SUBSCRIPTIONS_POST_COMPLETED)
export const subscriptionsPostError = createAction(constants.SUBSCRIPTIONS_POST_ERROR)
