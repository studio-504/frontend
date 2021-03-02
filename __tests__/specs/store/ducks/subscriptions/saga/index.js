import { spawn, call } from 'redux-saga/effects'
import notificationSubscription from 'store/ducks/subscriptions/saga/notifications'
import chatMessageSubscription from 'store/ducks/subscriptions/saga/chat'
import cardSubscription from 'store/ducks/subscriptions/saga/card'
import pollSubscription from 'store/ducks/subscriptions/saga/poll'
import subscriptions from 'store/ducks/subscriptions/saga'
import navigationSubscription from 'store/ducks/subscriptions/saga/navigation'

test('Subscriptions root saga', () => {
  expect(subscriptions()).toEqual([
    call(notificationSubscription),
    call(chatMessageSubscription),
    call(cardSubscription),
    call(pollSubscription),
    spawn(navigationSubscription),
  ])
})
