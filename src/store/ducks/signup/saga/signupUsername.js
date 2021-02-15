import { put, call, takeEvery } from 'redux-saga/effects'
import * as actions from 'store/ducks/signup/actions'
import * as constants from 'store/ducks/signup/constants'
import * as queries from 'store/ducks/signup/queries'
import * as queryService from 'services/Query'
import * as navigationActions from 'navigation/actions'
import { logEvent } from 'services/Analytics'
import * as NavigationService from 'services/Navigation'
import path from 'ramda/src/path'
import * as ErrorsService from 'services/Errors'

/**
 *
 */
function* handleSignupUsernameRequest(payload) {
  const data = yield queryService.apiRequest(queries.setUsername, { username: payload.username })
  const nextRoute = path(['nextRoute'], payload)
  const meta = { nextRoute }

  return { data, meta }
}

/**
 *
 */
function* signupUsernameRequest(req) {
  try {
    logEvent('SIGNUP_CHECK_REQUEST')
    const { data, meta } = yield call(handleSignupUsernameRequest, req.payload)
    yield put(actions.signupUsernameSuccess({
      message: ErrorsService.getMessagePayload(constants.SIGNUP_USERNAME_SUCCESS, 'GENERIC'),
      payload: req.payload,
      meta,
      data,
    }))
  } catch (error) {
    yield put(actions.signupUsernameFailure({
      message: ErrorsService.getMessagePayload(constants.SIGNUP_USERNAME_FAILURE, 'GENERIC', error),
      payload: req.payload,
    }))
  }
}

function* signupUsernameSuccess(req) {
  logEvent('SIGNUP_USERNAME_SUCCESS')

  const navigation = yield NavigationService.getNavigation()
  const nextRoute =  path(['payload', 'meta', 'nextRoute'], req)

  if (nextRoute === 'app') {
    navigationActions.navigateResetToApp(navigation) 
  } else {
    navigationActions.navigateAuthPassword(navigation)
  }
}

export default () => [
  takeEvery(constants.SIGNUP_USERNAME_REQUEST, signupUsernameRequest),
  takeEvery(constants.SIGNUP_USERNAME_SUCCESS, signupUsernameSuccess),
]