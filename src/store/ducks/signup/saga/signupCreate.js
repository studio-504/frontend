import { put, call, takeEvery, getContext } from 'redux-saga/effects'
import * as actions from 'store/ducks/signup/actions'
import * as constants from 'store/ducks/signup/constants'
import * as queries from 'store/ducks/signup/queries'
import * as queryService from 'services/Query'
import * as navigationActions from 'navigation/actions'
import { logEvent } from 'services/Analytics'
import Config from 'react-native-config'
import path from 'ramda/src/path'
import { generateExpirationDate } from 'store/ducks/signup/saga/helpers'

export const COGNITO_PROVIDER = `cognito-idp.${Config.AWS_COGNITO_REGION}.amazonaws.com/${Config.AWS_COGNITO_USER_POOL_ID}`

function* startChangeUserEmail({ email }) {
  const ReactNavigationRef = yield getContext('ReactNavigationRef')

  yield call([queryService, 'apiRequest'], queries.startChangeUserEmail, { email })

  navigationActions.navigateAuthEmailConfirm(ReactNavigationRef.current)
  yield call(logEvent, 'SIGNUP_EMAIL_SUCCESS')
}

function* startChangeUserPhoneNumber({ countryCode, phone }) {
  const ReactNavigationRef = yield getContext('ReactNavigationRef')

  const phoneNumber = `${countryCode}${phone}`
  yield call([queryService, 'apiRequest'], queries.startChangeUserPhoneNumber, { phoneNumber })

  navigationActions.navigateAuthPhoneConfirm(ReactNavigationRef.current)
  yield call(logEvent, 'SIGNUP_PHONE_SUCCESS')
}

function* startConfirmUsername(payload) {
  if (payload.usernameType === 'email') {
    yield call(startChangeUserEmail, payload)
  } else if (payload.usernameType === 'phone') {
    yield call(startChangeUserPhoneNumber, payload)
  } else {
    throw new Error('Unsupported usernameType')
  }
}

function* createAnonymousUser() {
  const response = yield call([queryService, 'apiRequest'], queries.createAnonymousUser)
  const tokens = path(['data', 'createAnonymousUser'], response)

  return tokens
}

function* cognitoIdentityPoolSignIn(tokens) {
  const AwsAuth = yield getContext('AwsAuth')
  const credentials = {
    token: tokens.IdToken,
    expires_at: generateExpirationDate(),
  }

  yield call([AwsAuth, 'federatedSignIn'], COGNITO_PROVIDER, credentials, {})
}

function* handleSignupCreateRequest(payload) {
  const tokens = yield call(createAnonymousUser)
  yield call(cognitoIdentityPoolSignIn, tokens)
  yield call(startConfirmUsername, payload)
}

/**
 *
 */
function* signupCreateRequest(req) {
  try {
    yield call(handleSignupCreateRequest, req.payload)
    yield put(actions.signupCreateSuccess())
  } catch (error) {
    if (error.message === 'USER_CONFIRMATION_DELIVERY') {
      yield put(actions.signupCreateFailure(error, { messageCode: 'USER_CONFIRMATION_DELIVERY' }))
    } else if (error.code === 'UsernameExistsException') {
      yield put(actions.signupCreateFailure(error, { messageCode: 'USER_EXISTS' }))
    } else if (error.code === 'InvalidPasswordException') {
      yield put(actions.signupCreateFailure(error, { messageCode: 'INVALID_PASSWORD' }))
    } else if (error.code === 'InvalidParameterException') {
      yield put(actions.signupCreateFailure(error, { messageCode: 'INVALID_PARAMETER' }))
    } else {
      yield put(actions.signupCreateFailure(error))
    }
  }
}

export default () => [takeEvery(constants.SIGNUP_CREATE_REQUEST, signupCreateRequest)]
