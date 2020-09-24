import { put, call, take, race, getContext, takeEvery } from 'redux-saga/effects'
import {
  federatedGoogleSignin,
} from 'services/AWS'
import * as actions from 'store/ducks/auth/actions'
import * as constants from 'store/ducks/auth/constants'
import * as errors from 'store/ducks/auth/errors'

/**
 * Authenticate using google into identity pool
 */
function* googleAuthentication() {
  const AwsAuth = yield getContext('AwsAuth')

  const google = yield federatedGoogleSignin()

  const userPayload = {
    id: google.user.id,
    name: google.user.name,
    email: google.user.email,
    authProvider: 'GOOGLE',
    token: google.token,
  }

  return yield AwsAuth.federatedSignIn('google', {
    token: google.token,
    expires_at: google.expires_at,
  }, userPayload)
}

function* handleAuthSigninGoogleRequest() {
  yield call(googleAuthentication)

  yield put(actions.authFlowRequest({ allowAnonymous: true }))
  const { flowSuccess, flowFailure } = yield race({
    flowSuccess: take(constants.AUTH_FLOW_SUCCESS),
    flowFailure: take(constants.AUTH_FLOW_FAILURE),
  })

  if (flowFailure) {
    throw new Error('Failed to obtain flow')
  }

  return flowSuccess
}

/**
 *
 */
function* authSigninGoogleRequest(req) {
  try {
    const data = yield handleAuthSigninGoogleRequest(req.payload)
    yield put(actions.authSigninGoogleSuccess({
      message: errors.getMessagePayload(constants.AUTH_SIGNIN_GOOGLE_SUCCESS, 'GENERIC'),
      data,
    }))
  } catch (error) {
    if (error.message && error.message.includes('The user canceled the sign in request')) {
      yield put(actions.authSigninGoogleFailure({
        message: errors.getMessagePayload(constants.AUTH_SIGNIN_GOOGLE_FAILURE, 'CANCELED', error.message),
      }))
    } else {
      yield put(actions.authSigninGoogleFailure({
        message: errors.getMessagePayload(constants.AUTH_SIGNIN_GOOGLE_FAILURE, 'GENERIC', error.message),
      }))
    }
  }
}

export default () => [
  takeEvery(constants.AUTH_SIGNIN_GOOGLE_REQUEST, authSigninGoogleRequest),
]