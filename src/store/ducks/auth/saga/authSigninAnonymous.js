import { put, call, getContext, takeEvery } from 'redux-saga/effects'
import * as actions from 'store/ducks/auth/actions'
import * as constants from 'store/ducks/auth/constants'
import * as queries from 'store/ducks/signup/queries'
import * as queryService from 'services/Query'
import Config from 'react-native-config'
import path from 'ramda/src/path'
import { generateExpirationDate } from 'store/ducks/signup/saga/helpers'
import * as navigationActions from 'navigation/actions'
import * as NavigationService from 'services/Navigation'

export const COGNITO_PROVIDER = `cognito-idp.${Config.AWS_COGNITO_REGION}.amazonaws.com/${Config.AWS_COGNITO_USER_POOL_ID}`

function* createAnonymousUser() {
  const response = yield call([queryService, 'apiRequest'], queries.createAnonymousUser)
  const tokens = path(['data', 'createAnonymousUser'], response)

  return tokens
}

export function* handleAnonymousSignin() {
  const AwsAuth = yield getContext('AwsAuth')
  const currentCredentials = yield AwsAuth.currentCredentials()

  if (!currentCredentials.authenticated) {
    const tokens = yield call(createAnonymousUser)
    const credentials = { token: tokens.IdToken, expires_at: generateExpirationDate() }
    yield call([AwsAuth, 'federatedSignIn'], COGNITO_PROVIDER, credentials, {})
  }

  yield put(actions.authUserRequest())
}

/**
 *
 */
function* authSigninAnonymousRequest() {
  try {
    yield call(handleAnonymousSignin)
    yield put(actions.authSigninAnonymousSuccess())
  } catch (error) {
    if (error.message && error.message.includes('The user canceled the sign in request')) {
      yield put(actions.authSigninAnonymousFailure(error, { messageCode: 'CANCELED' }))
    } else {
      yield put(actions.authSigninAnonymousFailure(error))
    }
  }
}

function* authSigninAnonymousSuccess() {
  try {
    yield put(actions.authPrefetchRequest())

    const navigation = yield NavigationService.getNavigation()
    navigationActions.navigateResetToApp(navigation)
  } catch (error) {
    //ignore
  }
}

export default () => [
  takeEvery(constants.AUTH_SIGNIN_ANONYMOUS_REQUEST, authSigninAnonymousRequest),
  takeEvery(constants.AUTH_SIGNIN_ANONYMOUS_SUCCESS, authSigninAnonymousSuccess),
]
