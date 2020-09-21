import { takeEvery, call } from 'redux-saga/effects'
import * as constants from 'store/ducks/subscriptions/constants'
import subscriptionNotificationStart from 'store/ducks/subscriptions/saga/notifications'
import chatMessageSubscription from 'store/ducks/subscriptions/saga/chat'
import cardSubscription from 'store/ducks/subscriptions/saga/card'
import appSubscription from 'store/ducks/subscriptions/saga/app'
import subscriptionPollStart from 'store/ducks/subscriptions/saga/poll'

export default () => [
  call(subscriptionNotificationStart),
  call(chatMessageSubscription),
  call(cardSubscription),
  takeEvery(constants.SUBSCRIPTIONS_PREFETCH_REQUEST, appSubscription),
  takeEvery(constants.SUBSCRIPTIONS_POLL_REQUEST, subscriptionPollStart),
]
