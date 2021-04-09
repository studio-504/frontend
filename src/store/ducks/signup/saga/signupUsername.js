import { put, call, takeEvery } from 'redux-saga/effects'
import * as authActions from 'store/ducks/auth/actions'
import * as actions from 'store/ducks/signup/actions'
import * as constants from 'store/ducks/signup/constants'
import * as queries from 'store/ducks/signup/queries'
import * as queryService from 'services/Query'
import * as navigationActions from 'navigation/actions'
import * as NavigationService from 'services/Navigation'
import path from 'ramda/src/path'

/**
 *
 */
function* handleSignupUsernameRequest(payload) {
  const nextRoute = path(['nextRoute'], payload)
  const navigation = yield NavigationService.getNavigation()

  yield call([queryService, 'apiRequest'], queries.setUsername, { username: payload.username })

  if (nextRoute === 'app') {
    yield put(authActions.authUserRequest())
    yield put(authActions.authPrefetchRequest())

    navigationActions.navigateResetToApp(navigation)
  } else {
    navigationActions.navigateAuthPassword(navigation)
  }
}

/**
 *
 */
function* signupUsernameRequest(req) {
  try {
    yield call(handleSignupUsernameRequest, req.payload)
    yield put(actions.signupUsernameSuccess())
  } catch (error) {
    yield put(actions.signupUsernameFailure(error))
  }
}

export default () => [takeEvery(constants.SIGNUP_USERNAME_REQUEST, signupUsernameRequest)]
