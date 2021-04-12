import { put, call, race, take, getContext, takeEvery } from 'redux-saga/effects'
import * as actions from 'store/ducks/auth/actions'
import * as constants from 'store/ducks/auth/constants'
import { federatedGoogleSignout } from 'services/AWS'
import * as navigationActions from 'navigation/actions'
import * as subscriptionsActions from 'store/ducks/subscriptions/actions'

/**
 * Remove cognito credentials
 */
function* handleAuthSignoutRequest() {
  const AwsAuth = yield getContext('AwsAuth')

  yield call([AwsAuth, 'signOut'], { global: true })

  yield put(actions.authResetRequest({}))
  yield race({
    resetSuccess: take(constants.AUTH_RESET_SUCCESS),
    resetFailure: take(constants.AUTH_RESET_FAILURE),
  })

  yield call(federatedGoogleSignout)

  yield put(actions.authFlowIdle())

  return {
    meta: {
    },
    data: {
    },
  }
}

function* authSignoutRequest(req) {
  try {
    const { data, meta } = yield handleAuthSignoutRequest(req.payload)
    yield put(actions.authSignoutSuccess({ data, meta }))
  } catch (error) {
    yield put(actions.authSignoutFailure(error, { authenticated: false }))
  }
}

function* authSignoutSuccess() {
  yield put(subscriptionsActions.subscriptionsMainIdle())
  yield put(subscriptionsActions.subscriptionsPollIdle())

  const ReactNavigationRef = yield getContext('ReactNavigationRef')
  navigationActions.navigateReset(ReactNavigationRef.current)
}

export default () => [
  takeEvery(constants.AUTH_SIGNOUT_REQUEST, authSignoutRequest),
  takeEvery(constants.AUTH_SIGNOUT_SUCCESS, authSignoutSuccess),
]
