import { put, getContext, takeEvery } from 'redux-saga/effects'
import {
  federatedGoogleSignin,
} from 'services/AWS'
import * as actions from 'store/ducks/auth/actions'
import * as constants from 'store/ducks/auth/constants'
import * as errors from 'store/ducks/auth/errors'

/**
 *
 */
function* handleAuthGoogleRequest() {
  const AwsAuth = yield getContext('AwsAuth')

  const google = yield federatedGoogleSignin()

  const userPayload = {
    id: google.user.id,
    name: google.user.name,
    email: google.user.email,
    authProvider: 'GOOGLE',
    token: google.token,
  }

  yield AwsAuth.federatedSignIn('google', {
    token: google.token,
    expires_at: google.expires_at,
  }, userPayload)

  return google
}

/**
 *
 */
function* authSigninGoogleRequest(req) {
  try {
    const data = yield handleAuthGoogleRequest(req.payload)
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