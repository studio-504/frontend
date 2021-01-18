import { takeEvery, spawn, call } from 'redux-saga/effects'
import * as constants from 'store/ducks/subscriptions/constants'
import subscriptionNotificationStart from 'store/ducks/subscriptions/saga/notifications'
import chatMessageSubscription from 'store/ducks/subscriptions/saga/chat'
import cardSubscription from 'store/ducks/subscriptions/saga/card'
import subscriptionPollStart from 'store/ducks/subscriptions/saga/poll'
import subscriptions from 'store/ducks/subscriptions/saga'
import navigationSubscription from 'store/ducks/subscriptions/saga/navigation'

test('Subscriptions root saga', () => {
  expect(subscriptions()).toEqual([
    call(subscriptionNotificationStart),
    call(chatMessageSubscription),
    call(cardSubscription),
    takeEvery(constants.SUBSCRIPTIONS_POLL_REQUEST, subscriptionPollStart),
    spawn(navigationSubscription),
  ])
})
