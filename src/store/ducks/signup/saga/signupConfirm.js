import { put, getContext, call, takeEvery } from 'redux-saga/effects'
import * as actions from 'store/ducks/signup/actions'
import * as constants from 'store/ducks/signup/constants'
import * as queries from 'store/ducks/signup/queries'
import * as queryService from 'services/Query'
import * as navigationActions from 'navigation/actions'
import { logEvent } from 'services/Analytics'
import { Keyboard } from 'react-native'
import * as ErrorsService from 'services/Errors'
import propOr from 'ramda/src/propOr'

/**
 *
 */
function* queryBasedOnSignupType(payload) {
  if (payload.usernameType === 'email') {
    yield queryService.apiRequest(queries.finishChangeUserEmail, { verificationCode: payload.confirmationCode })
  } else if (payload.usernameType === 'phone') {
    yield queryService.apiRequest(queries.finishChangeUserPhoneNumber, { verificationCode: payload.confirmationCode })
  } else {
    throw new Error('Unsupported usernameType')
  }
}

function* handleSignupConfirmRequest(payload) {
  yield call(queryBasedOnSignupType, payload)
}

/**
 *
 */
function* signupConfirmRequest(req) {
  try {
    logEvent('SIGNUP_CONFIRM_REQUEST')
    const data = yield handleSignupConfirmRequest(req.payload)
    yield put(actions.signupConfirmSuccess({
      message: ErrorsService.getMessagePayload(constants.SIGNUP_CONFIRM_SUCCESS, 'GENERIC'),
      payload: req.payload,
      data,
    }))
  } catch (error) {
    const errorCode = propOr('GENERIC', error.code, {
      'AliasExistsException': 'ALIAS_EXISTS',
      'ExpiredCodeException': 'CODE_EXPIRED',
      'CodeMismatchException': 'CODE_MISMATCH',
    })

    yield put(actions.signupConfirmFailure(error, { errorCode }))
  }
}

function* signupConfirmSuccess() {
  const ReactNavigationRef = yield getContext('ReactNavigationRef')
  navigationActions.navigateAuthUsername(ReactNavigationRef.current)
  logEvent('SIGNUP_CONFIRM_SUCCESS')

  yield put(actions.signupCreateIdle({}))
  yield put(actions.signupConfirmIdle({}))
  yield put(actions.signupPasswordIdle({}))

  Keyboard.dismiss()
}

export default () => [
  takeEvery(constants.SIGNUP_CONFIRM_REQUEST, signupConfirmRequest),
  takeEvery(constants.SIGNUP_CONFIRM_SUCCESS, signupConfirmSuccess),
]
