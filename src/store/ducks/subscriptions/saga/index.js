import { call, spawn } from 'redux-saga/effects'
import notificationSubscription from 'store/ducks/subscriptions/saga/notifications'
import chatMessageSubscription from 'store/ducks/subscriptions/saga/chat'
import cardSubscription from 'store/ducks/subscriptions/saga/card'
import pollSubscription from 'store/ducks/subscriptions/saga/poll'
import navigationSubscription from 'store/ducks/subscriptions/saga/navigation'

export default () => [
  call(notificationSubscription),
  call(chatMessageSubscription),
  call(cardSubscription),
  call(pollSubscription),
  spawn(navigationSubscription),
]
