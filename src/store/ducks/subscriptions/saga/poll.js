import * as Logger from 'services/Logger'
import { call, put, take, fork } from 'redux-saga/effects'
import * as postsActions from 'store/ducks/posts/actions'
import * as constants from 'store/ducks/subscriptions/constants'
import { intervalEmitter } from 'store/ducks/subscriptions/saga/helpers'

/**
 *
 */
function* pollSubscription() {
  while (true) {
    yield take(constants.SUBSCRIPTIONS_POLL_REQUEST)

    try {
      const channel = yield call(intervalEmitter, {
        frequency: 30 * 60000,
      })

      yield fork(function* eventListener() {
        while (true) {
          yield take(channel)
          yield put(postsActions.postsGetTrendingPostsRequest())
        }
      })

      /**
       * Close channel subscription on application toggle
       */
      yield take(constants.SUBSCRIPTIONS_POLL_IDLE)
      channel.close()
    } catch (error) {
      Logger.captureException(error)
    }
  } 
}

export default pollSubscription
