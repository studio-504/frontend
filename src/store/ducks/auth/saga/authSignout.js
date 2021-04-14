import { put, call, getContext, takeEvery } from 'redux-saga/effects'
import * as actions from 'store/ducks/auth/actions'
import * as constants from 'store/ducks/auth/constants'
import { federatedGoogleSignout } from 'services/AWS'
import * as navigationActions from 'navigation/actions'
import * as subscriptionsActions from 'store/ducks/subscriptions/actions'

const SINGOUT_ACTIONS = [
  constants.AUTH_SIGNOUT_REQUEST,
  constants.AUTH_FLOW_FAILURE,
  constants.AUTH_SIGNIN_ANONYMOUS_FAILURE,
  constants.AUTH_SIGNIN_APPLE_FAILURE,
  constants.AUTH_SIGNIN_COGNITO_FAILURE,
  constants.AUTH_SIGNIN_GOOGLE_FAILURE,
]

/**
 * Remove cognito credentials
 */
function* handleAuthSignoutRequest() {
  const AwsAuth = yield getContext('AwsAuth')

  yield call([AwsAuth, 'signOut'])
  yield call(federatedGoogleSignout)

  yield put(subscriptionsActions.subscriptionsMainIdle())
  yield put(subscriptionsActions.subscriptionsPollIdle())

  const ReactNavigationRef = yield getContext('ReactNavigationRef')
  navigationActions.navigateReset(ReactNavigationRef.current)
}

function* authSignoutRequest() {
  try {
    yield handleAuthSignoutRequest()
    yield put(actions.authSignoutSuccess())
  } catch (error) {
    yield put(actions.authSignoutFailure(error))
  }
}

export default () => [takeEvery(SINGOUT_ACTIONS, authSignoutRequest)]
