import { call, put, getContext, takeEvery } from 'redux-saga/effects'
import * as actions from 'store/ducks/auth/actions'
import * as constants from 'store/ducks/auth/constants'
import * as errors from 'store/ducks/auth/errors'
import * as queries from 'store/ducks/auth/queries'
import * as queryService from 'services/Query'
import Config from 'react-native-config'

/**
 *
 */
function* handleAuthSigninAnonymousRequest() {
  const AwsAuth = yield getContext('AwsAuth')
  const AwsStorage = yield getContext('AwsStorage')

  const credentials = yield call([AwsAuth, 'currentUserCredentials'], { bypassCache: false })

  if (credentials.message && credentials.message.includes('Access to Identity') && credentials.message.includes('is forbidden')) {
    yield call([AwsStorage, 'removeItem'], `CognitoIdentityId-${Config.AWS_COGNITO_IDENTITY_POOL_ID}`)
    return yield call([AwsAuth, 'currentUserCredentials'], { bypassCache: false })
  }

  yield call([queryService, 'apiRequest'], queries.createAnonymousUser)
}

/**
 *
 */
function* authSigninAnonymousRequest(req) {
  try {
    const data = yield handleAuthSigninAnonymousRequest(req.payload)
    yield put(actions.authSigninAnonymousSuccess({
      message: errors.getMessagePayload(constants.AUTH_SIGNIN_ANONYMOUS_SUCCESS, 'GENERIC'),
      data,
    }))
  } catch (error) {
    if (error.message && error.message.includes('The user canceled the sign in request')) {
      yield put(actions.authSigninAnonymousFailure({
        message: errors.getMessagePayload(constants.AUTH_SIGNIN_ANONYMOUS_FAILURE, 'CANCELED', error.message),
      }))
    } else {
      yield put(actions.authSigninAnonymousFailure({
        message: errors.getMessagePayload(constants.AUTH_SIGNIN_ANONYMOUS_FAILURE, 'GENERIC', error.message),
      }))
    }
  }
}

export default () => [
  takeEvery(constants.AUTH_SIGNIN_ANONYMOUS_REQUEST, authSigninAnonymousRequest),
]