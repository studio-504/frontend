import { put, call, select, takeEvery } from 'redux-saga/effects'
import * as actions from 'store/ducks/auth/actions'
import * as constants from 'store/ducks/auth/constants'
import * as subscriptionsActions from 'store/ducks/subscriptions/actions'
import * as postsActions from 'store/ducks/posts/actions'
import * as usersActions from 'store/ducks/users/actions'
import * as chatActions from 'store/ducks/chat/actions'
import * as authSelector from 'store/ducks/auth/selectors'

function* handleAuthPrefetchCommon() {
  /**
   * 1. Feed
   */
  yield put(postsActions.postsFeedGetRequest())

  /**
   * 2. Trending
   */
  yield put(postsActions.postsGetTrendingPostsRequest())

  /**
   * 3. In-app notification cards
   */
  yield put(usersActions.usersGetCardsRequest())
}

/**
 * Used sequential approach to load data in UI order
 */
function* handleAuthPrefetchAuthenticated() {
  const userId = yield select(authSelector.authUserIdSelector)

  /**
   * 1. Common
   */
  yield call(handleAuthPrefetchCommon)

  /**
   * 2. Stories
   */
  yield put(usersActions.usersGetFollowedUsersWithStoriesRequest())

  /**
   * Graphql Subscriptions trigger
   * Implement subscription await + offline cache
   * Should we implement success/failure check ?!
   */
  yield put(subscriptionsActions.subscriptionsMainRequest())
  yield put(subscriptionsActions.subscriptionsPollRequest())

  /**
   * Data which is important to load but not belongs to home screen
   * Sequential approach wasn't used cuz some calls are expensive and not top priority
   */
  yield put(usersActions.usersGetPendingFollowersRequest({ userId }))
  yield put(chatActions.chatGetChatsRequest())
  yield put(postsActions.postsGetUnreadCommentsRequest())
  yield put(usersActions.usersGetProfileSelfRequest())
}

/**
 * Used sequential approach to load data in UI order
 */
function* handleAuthPrefetchRequest() {
  const authenticationType = yield select(state => state.auth.authToken.meta.type)

  if (authenticationType === 'COGNITO_AUTHENTICATED') {
    yield call(handleAuthPrefetchAuthenticated)
  } else if (authenticationType === 'COGNITO_GUEST') {
    yield call(handleAuthPrefetchCommon)
  } else {
    yield put(actions.authSignoutRequest())
  }
}

/**
 * Fetching initial data such as feed/cards/trending
 */
function* authPrefetchRequest(req) {
  try {
    yield handleAuthPrefetchRequest(req.payload)
    yield put(actions.authPrefetchSuccess())
  } catch (error) {
    yield put(actions.authPrefetchFailure(error))
  }
}

export default () => [
  takeEvery(constants.AUTH_PREFETCH_REQUEST, authPrefetchRequest),
]
