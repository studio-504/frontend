import { call, put, take, fork } from 'redux-saga/effects'
import * as postsActions from 'store/ducks/posts/actions'
import * as usersActions from 'store/ducks/users/actions'
import * as usersQueries from 'store/ducks/users/queries'
import * as constants from 'store/ducks/subscriptions/constants'
import { createChannel } from 'store/ducks/subscriptions/saga/helpers'

/**
 * Cards subscription channel
 */
function* cardSubscription() {
  while (true) {
    yield take(constants.SUBSCRIPTIONS_MAIN_REQUEST)

    try {
      const { channel, userId } = yield call(createChannel, {
        query: usersQueries.onCardNotification,
      })

      yield fork(function* eventListener() {
        while (true) {
          yield take(channel)
          yield fork(function* () {
            yield put(usersActions.usersGetCardsRequest({}))
            yield put(postsActions.postsGetUnreadCommentsRequest({ limit: 20 }))
            yield put(usersActions.usersGetProfileSelfRequest({ userId }))
            yield put(usersActions.usersGetPendingFollowersRequest({ userId }))
          })
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

export default cardSubscription
