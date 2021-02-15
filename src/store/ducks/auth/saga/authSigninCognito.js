import { put, call, take, race, getContext, takeEvery } from 'redux-saga/effects'
import * as actions from 'store/ducks/auth/actions'
import * as constants from 'store/ducks/auth/constants'
import * as ErrorsService from 'services/Errors'

/**
 * Authenticate using cognito into user pool
 */
function* cognitoAuthentication(payload) {
  const AwsAuth = yield getContext('AwsAuth')
  yield AwsAuth.signIn(payload.username, payload.password)
}

/**
 * Signin user. Currently supports email and password or phone number and password methods
 */
function* handleAuthSigninRequest(payload) {
  yield call(cognitoAuthentication, payload)

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

function* authSigninCognitoRequest(req) {
  try {
    yield handleAuthSigninRequest(req.payload)
    yield put(actions.authSigninCognitoSuccess())
  } catch (error) {
    if (error.code === 'UserNotConfirmedException') {
      yield put(actions.authSigninCognitoFailure({
        message: ErrorsService.getMessagePayload(constants.AUTH_SIGNIN_COGNITO_FAILURE, 'USER_NOT_CONFIRMED', error),
      }))
    } else if (error.code === 'UserNotFoundException') {
      yield put(actions.authSigninCognitoFailure({
        message: ErrorsService.getMessagePayload(constants.AUTH_SIGNIN_COGNITO_FAILURE, 'USER_NOT_FOUND', error),
      }))
    } else if (error.code === 'NotAuthorizedException') {
      yield put(actions.authSigninCognitoFailure({
        message: ErrorsService.getMessagePayload(constants.AUTH_SIGNIN_COGNITO_FAILURE, 'USER_NOT_AUTHORIZED', error),
      }))
    } else if (error.code === 'InvalidParameterException') {
      yield put(actions.authSigninCognitoFailure({
        message: ErrorsService.getMessagePayload(constants.AUTH_SIGNIN_COGNITO_FAILURE, 'INVALID_PARAMETER', error),
      }))
    } else {
      yield put(actions.authSigninCognitoFailure({
        message: ErrorsService.getMessagePayload(constants.AUTH_SIGNIN_COGNITO_FAILURE, 'GENERIC', error),
      }))
    }
  }
}

export default () => [
  takeEvery(constants.AUTH_SIGNIN_COGNITO_REQUEST, authSigninCognitoRequest),
]