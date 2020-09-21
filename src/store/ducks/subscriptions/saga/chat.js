import { call, put, take, fork } from 'redux-saga/effects'
import path from 'ramda/src/path'
import * as usersActions from 'store/ducks/users/actions'
import * as chatQueries from 'store/ducks/chat/queries'
import * as chatActions from 'store/ducks/chat/actions'
import * as constants from 'store/ducks/subscriptions/constants'
import { createChannel } from 'store/ducks/subscriptions/saga/helpers'

/**
 *
 */
function* chatMessageSubscription() {
  while (true) {
    yield take(constants.SUBSCRIPTIONS_MAIN_REQUEST)

    try {
      const { channel, userId } = yield call(createChannel, {
        query: chatQueries.onChatMessageNotification,
      })

      yield fork(function* eventListener() {
        while (true) {
          const event = yield take(channel)
          yield fork(function* ({ eventData }) {
            const data = path(['value', 'data', 'onChatMessageNotification'])(eventData)
            const chatId = path(['message', 'chat', 'chatId'])(data)

            yield put(chatActions.chatGetChatRequest({ chatId }))
            yield put(chatActions.chatGetChatsRequest())
            yield put(usersActions.usersGetProfileSelfRequest({ userId }))
          }, event)
        }
      })

      /**
       * Close channel subscription on application toggle
       */
      yield take(constants.SUBSCRIPTIONS_MAIN_IDLE)
      channel.close()
    } catch (error) {
      // ignore
    }
  }
}

export default chatMessageSubscription
