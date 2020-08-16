import { graphqlOperation } from '@aws-amplify/api'
import { call, put, take, takeEvery, takeLatest, getContext, select } from 'redux-saga/effects'
import { eventChannel } from 'redux-saga'
import path from 'ramda/src/path'
import * as postsActions from 'store/ducks/posts/actions'
import * as usersActions from 'store/ducks/users/actions'
import * as postsQueries from 'store/ducks/posts/queries'
import * as usersQueries from 'store/ducks/users/queries'
import * as chatQueries from 'store/ducks/chat/queries'
import * as chatActions from 'store/ducks/chat/actions'
import * as subscriptionsActions from 'store/ducks/subscriptions/actions'
import * as constants from 'store/ducks/subscriptions/constants'
import * as queryService from 'services/Query'
import * as Logger from 'services/Logger'

/**
 * Subscription state handler, used for preventing multiple subscriptions on the same topic
 */
function* subscriptionStateHandler({ identifier }) {
  const isRunning = yield select(state => state.subscriptions.subscriptionsMain.data.find(item => item === identifier))

  /**
   * graphql error handler, possible errors are:
   * - connection closed
   * - connection timeout
   * - handshake error
   */
  function* failureHandler(error) {
    yield put(subscriptionsActions.subscriptionsMainFailure({ data: identifier }))
    Logger.withScope(scope => {
      scope.setExtra('payload', JSON.stringify(error))
      Logger.captureMessage('SUBSCRIPTIONS_EMITTER_ERROR')
    })
  }

  function* idleHandler(api) {
    yield put(subscriptionsActions.subscriptionsMainIdle({ data: identifier }))
    api.unsubscribe()
  }

  function* successHandler() {
    yield put(subscriptionsActions.subscriptionsMainSuccess({ data: identifier }))
  }

  return {
    isRunning,
    successHandler,
    failureHandler,
    idleHandler,
  }
}

/**
 * Apollo subscription channel messagee emitter, used for graphql subscriptions
 */
function subscriptionEmitter({ subscription }) {
  /**
   * triggered on redux-saga channel close event
   */

  return eventChannel(emitter => {
    const api = subscription.subscribe({
      next: (args) => emitter({ eventType: 'next', eventData: args }),
      error: (args) => emitter({ eventType: 'error', eventData: args }),
    })

    if (api._state === 'ready') {
      emitter({ eventType: 'start', eventData: api })
    } else if (api._state === 'closed') {
      emitter({ eventType: 'idle', eventData: api })
    }

    return () => emitter({ eventType: 'close', eventData: api })
  })
}

/**
 * Interval channel message emitter, used for grapql polling
 */
function intervalEmitter({ frequency }) {
  return eventChannel(emitter => {
    const interval = setInterval(() => {
      emitter({})
    }, frequency)

    return () => clearInterval(interval)
  })
}

/**
 * main application state pre-loader
 * to be triggered when app just opened or switched background/foreground state
 */
function* appSubscription(req) {
  const userId = path(['payload'])(req)

  yield put(usersActions.usersGetCardsRequest({}))
  yield put(postsActions.postsFeedGetRequest({ limit: 20 }))
  yield put(postsActions.postsGetTrendingPostsRequest({ limit: 100 }))
  yield put(usersActions.usersGetPendingFollowersRequest({ userId }))
  yield put(usersActions.usersGetFollowedUsersWithStoriesRequest({}))
  yield put(chatActions.chatGetChatsRequest({}))
}

/**
 * Cards subscription channel
 */
function* cardSubscription(req) {
  const AwsAPI = yield getContext('AwsAPI')
  const userId = path(['payload'])(req)

  /**
   * check if subscription is already running
   */
  const subscriptionState = yield call(subscriptionStateHandler, { identifier: 'onCardNotification' })

  if (subscriptionState.isRunning) {
    return
  }

  const subscription = AwsAPI.graphql(
    graphqlOperation(usersQueries.onCardNotification, { userId }),
  )

  const channel = yield call(subscriptionEmitter, {
    subscription,
    subscriptionState,
  })

  yield takeEvery(channel, function *({ eventType, eventData }) {
    if (eventType === 'start') {
      return yield call(subscriptionState.successHandler, eventData)
    }

    else if (eventType === 'error') {
      return yield call(subscriptionState.failureHandler, eventData)
    }

    else if (eventType === 'close') {
      return yield call(subscriptionState.idleHandler, eventData)
    }

    yield put(usersActions.usersGetCardsRequest({}))
    yield put(postsActions.postsGetUnreadCommentsRequest({ limit: 20 }))
    yield put(usersActions.usersGetProfileSelfRequest({ userId }))
    yield put(usersActions.usersGetPendingFollowersRequest({ userId }))
  })

  /**
   * Close channel subscription on application toggle
   */
  yield take(constants.SUBSCRIPTIONS_MAIN_IDLE)
  channel.close()
}

/**
 *
 */
function* chatMessageSubscription(req) {
  const AwsAPI = yield getContext('AwsAPI')
  const userId = path(['payload'])(req)

  /**
   * check if subscription is already running
   */
  const subscriptionState = yield call(subscriptionStateHandler, { identifier: 'onChatMessageNotification' })

  if (subscriptionState.isRunning) {
    return
  }

  const subscription = AwsAPI.graphql(
    graphqlOperation(chatQueries.onChatMessageNotification, { userId }),
  )

  const channel = yield call(subscriptionEmitter, {
    subscription,
    subscriptionState,
  })

  yield takeEvery(channel, function *({ eventType, eventData }) {
    if (eventType === 'start') {
      return yield call(subscriptionState.successHandler, eventData)
    }

    else if (eventType === 'error') {
      return yield call(subscriptionState.failureHandler, eventData)
    }

    else if (eventType === 'close') {
      return yield call(subscriptionState.idleHandler, eventData)
    }

    const data = path(['value', 'data', 'onChatMessageNotification'])(eventData)
    const chatId = path(['message', 'chat', 'chatId'])(data)

    yield put(chatActions.chatGetChatRequest({ chatId }))
    yield put(chatActions.chatGetChatsRequest())
    yield put(usersActions.usersGetProfileSelfRequest({ userId }))
  })

  /**
   * Close channel subscription on application toggle
   */
  yield take(constants.SUBSCRIPTIONS_MAIN_IDLE)
  channel.close()
}

/**
 * New subscription that is used for various real-time updates
 */
function* subscriptionNotificationStart(req) {
  const AwsAPI = yield getContext('AwsAPI')
  const userId = path(['payload'])(req)

  /**
   * check if subscription is already running
   */
  const subscriptionState = yield call(subscriptionStateHandler, { identifier: 'onNotification' })

  if (subscriptionState.isRunning) {
    return
  }

  const subscription = AwsAPI.graphql(
    graphqlOperation(usersQueries.onNotification, { userId }),
  )

  const channel = yield call(subscriptionEmitter, {
    subscription,
    subscriptionState,
  })

  yield takeEvery(channel, function *({ eventType, eventData }) {
    if (eventType === 'start') {
      return yield call(subscriptionState.successHandler, eventData)
    }

    else if (eventType === 'error') {
      return yield call(subscriptionState.failureHandler, eventData)
    }

    else if (eventType === 'close') {
      return yield call(subscriptionState.idleHandler, eventData)
    }

    const postId = path(['value', 'data', 'onNotification', 'postId'])(eventData)
    const userId = path(['value', 'data', 'onNotification', 'userId'])(eventData)
    const type = path(['value', 'data', 'onNotification', 'type'])(eventData)

    /**
     * Fires when one of the user's followeds changes their first story
     */
    if (type === 'USER_CHATS_WITH_UNVIEWED_MESSAGES_COUNT_CHANGED') {
      yield put(usersActions.usersGetProfileSelfRequest({ userId }))
    }

    /**
     * Fires when a post is added to User.feed
     */
    if (type === 'USER_FEED_POST_ADDED') {
      console.log(type)
      yield put(postsActions.postsFeedGetRequest({ limit: 20 }))
    }

    /**
     * Fires when User.chatsWithUnviewedMessagesCount changes
     */
    if (type === 'USER_FOLLOWED_USERS_WITH_STORIES_CHANGED') {
      yield put(usersActions.usersGetFollowedUsersWithStoriesRequest({}))
    }

    /**
     * Fires when one of the user's posts reaches COMPLETED state for the first time
     */
    if (type === 'POST_COMPLETED') {
      const data = yield queryService.apiRequest(postsQueries.getPost, { postId })
      const selector = path(['data', 'post'])

      yield put(postsActions.postsCreateSuccess({ data: {}, payload: selector(data), meta: {} }))
      yield put(postsActions.postsGetRequest({ userId }))
      yield put(usersActions.usersImagePostsGetRequest({ userId }))
    }

    /**
     * Fires when one of the user's posts reaches ERROR state
     */
    if (type === 'POST_ERROR') {
      const data = yield queryService.apiRequest(postsQueries.getPost, { postId })
      const selector = path(['data', 'post'])
      yield put(postsActions.postsCreateFailure({ data: {}, payload: selector(data), meta: {} }))
    }
  })

  /**
   * Close channel subscription on application toggle
   */
  yield take(constants.SUBSCRIPTIONS_MAIN_IDLE)
  channel.close()
}

/**
 *
 */
function* subscriptionPollStart() {
  const channel = yield call(intervalEmitter, {
    frequency: (30 * 60000),
  })

  yield takeEvery(channel, function *() {
    yield put(postsActions.postsGetTrendingPostsRequest({ limit: 100 }))
  })

  /**
   * Close channel subscription on application toggle
   */
  yield take(constants.SUBSCRIPTIONS_POLL_IDLE)
  channel.close()
}

export default () => [
  takeLatest(constants.SUBSCRIPTIONS_MAIN_REQUEST, subscriptionNotificationStart),
  takeLatest(constants.SUBSCRIPTIONS_MAIN_REQUEST, chatMessageSubscription),
  takeLatest(constants.SUBSCRIPTIONS_MAIN_REQUEST, cardSubscription),
  takeLatest(constants.SUBSCRIPTIONS_MAIN_REQUEST, appSubscription),
  takeLatest(constants.SUBSCRIPTIONS_POLL_REQUEST, subscriptionPollStart),
]