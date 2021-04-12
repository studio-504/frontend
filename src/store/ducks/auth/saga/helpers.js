import { put, race, take } from 'redux-saga/effects'
import * as actions from 'store/ducks/auth/actions'
import * as navigationActions from 'navigation/actions'
import * as NavigationService from 'services/Navigation'
import * as constants from 'store/ducks/auth/constants'

export function* authorize() {
  const navigation = yield NavigationService.getNavigation()

  yield put(actions.authGetUserRequest())

  const { getUserFailure } = yield race({
    getUserSuccess: take(constants.AUTH_GET_USER_SUCCESS),
    getUserFailure: take(constants.AUTH_GET_USER_FAILURE),
  })

  if (getUserFailure) {
    throw new Error('Failed to fetch self profile')
  }

  yield put(actions.authPrefetchRequest())

  navigationActions.navigateResetToApp(navigation)
}
