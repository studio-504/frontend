import Config from 'react-native-config'
import { put, race, take, call, getContext } from 'redux-saga/effects'
import * as actions from 'store/ducks/auth/actions'
import * as navigationActions from 'navigation/actions'
import * as NavigationService from 'services/Navigation'
import * as constants from 'store/ducks/auth/constants'
import * as pushActions from 'store/ducks/push/actions'

/**
 *
 */
function* resetCognitoFederated() {
  const AwsCache = yield getContext('AwsCache')
  const AwsCredentials = yield getContext('AwsCredentials')

  yield call([AwsCache, 'removeItem'], 'aws-amplify-federatedInfo')
  yield call([AwsCache, 'removeItem'], `CognitoIdentityId-${Config.AWS_COGNITO_IDENTITY_POOL_ID}`)
  yield call([AwsCredentials, 'clear'])
}

/**
 *
 */
export function* currentUserCredentials() {
  const AwsAuth = yield getContext('AwsAuth')

  const credentials = yield AwsAuth.currentUserCredentials({ bypassCache: true })

  if (credentials instanceof Error) {
    yield call(resetCognitoFederated)
    return yield AwsAuth.currentUserCredentials({ bypassCache: true })
  } else {
    return credentials
  }
}

function* authorize() {
  const navigation = yield NavigationService.getNavigation()

  yield call(currentUserCredentials)
  yield put(actions.authGetUserRequest())

  const { getUserFailure } = yield race({
    getUserSuccess: take(constants.AUTH_GET_USER_SUCCESS),
    getUserFailure: take(constants.AUTH_GET_USER_FAILURE),
  })

  if (getUserFailure) {
    throw getUserFailure.payload
  }

  yield put(actions.authPrefetchRequest())
  yield put(pushActions.pushStartRequest())

  navigationActions.navigateResetToApp(navigation)
}

export default authorize
