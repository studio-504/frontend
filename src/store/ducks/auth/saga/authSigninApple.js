import { put, call, getContext, takeEvery } from 'redux-saga/effects'
import {
  federatedAppleSignin,
  validateUserExistance,
} from 'services/AWS'
import * as actions from 'store/ducks/auth/actions'
import * as constants from 'store/ducks/auth/constants'
import * as queries from 'store/ducks/auth/queries'
import * as queryService from 'services/Query'
import { handleAnonymousSignin } from 'store/ducks/auth/saga/authSigninAnonymous'
import * as navigationActions from 'navigation/actions'
import * as NavigationService from 'services/Navigation'

function* getApplePayload() {
  const apple = yield call(federatedAppleSignin)

  const userPayload = {
    id: apple.user.id,
    fullName: apple.user.fullName,
    email: apple.user.email,
    authProvider: 'APPLE',
    token: apple.token,
    expires_at: apple.expires_at,
  }

  return userPayload
}

/**
 *
 */
function* handleAppleSignin(userPayload) {
  const AwsAuth = yield getContext('AwsAuth')
  const credentials = {
    token: userPayload.token,
    expires_at: userPayload.expires_at,
  }

  yield call([AwsAuth, 'federatedSignIn'], 'appleid.apple.com', credentials, userPayload)
}


function* appleSignUpFlow(userPayload) {
  const navigation = yield NavigationService.getNavigation()

  yield call(handleAnonymousSignin)
  yield call([queryService, 'apiRequest'], queries.linkAppleLogin, { appleIdToken: userPayload.token })
  yield call([queryService, 'apiRequest'], queries.setFullname, { fullName: userPayload.fullName })
  yield call(handleAppleSignin, userPayload)

  navigationActions.navigateAuthUsername(navigation, { nextRoute: 'app' })
}

function* appleSignInFlow(userPayload) {
  const navigation = yield NavigationService.getNavigation()

  yield call(handleAppleSignin, userPayload)

  yield put(actions.authUserRequest())
  yield put(actions.authPrefetchRequest())

  navigationActions.navigateResetToApp(navigation)
}

function* handleAuthAppleRequest() {
  const userPayload = yield call(getApplePayload)
  const userExists = yield call(validateUserExistance, userPayload)

  if (!userExists) {
    yield call(appleSignUpFlow, userPayload)
  } else {
    yield call(appleSignInFlow, userPayload)
  }
}

/**
 *
 */
function* authSigninAppleRequest(req) {
  try {
    yield handleAuthAppleRequest(req.payload)
    yield put(actions.authSigninAppleSuccess())
  } catch (error) {
    if (error.message && error.message.includes('The user canceled the sign in request')) {
      yield put(actions.authSigninAppleFailure(error, { messageCode: 'CANCELED' }))
    } else {
      yield put(actions.authSigninAppleFailure(error))
    }
  }
}

export default () => [
  takeEvery(constants.AUTH_SIGNIN_APPLE_REQUEST, authSigninAppleRequest),
]
