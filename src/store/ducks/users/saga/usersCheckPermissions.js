import { getContext, select } from 'redux-saga/effects'
import * as authSelector from 'store/ducks/auth/selectors'
import * as navigationActions from 'navigation/actions'
import * as UserService from 'services/User'
import * as ErrorsService from 'services/Errors'

function* usersCheckPermissions() {
  const authUser = yield select(authSelector.authUserSelector)

  if (!UserService.isUserActive(authUser)) {
    const ReactNavigationRef = yield getContext('ReactNavigationRef')
    navigationActions.navigateProfileUpgrade(ReactNavigationRef.current)

    throw new Error(ErrorsService.MESSAGES.USER_IS_NOT_ACTIVE)
  }
}

export default usersCheckPermissions
