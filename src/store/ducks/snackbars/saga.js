import { takeEvery, call, select } from 'redux-saga/effects'
import { showMessage } from 'react-native-flash-message'
import * as authConstants from 'store/ducks/auth/constants'
import * as usersConstants from 'store/ducks/users/constants'
import * as cacheConstants from 'store/ducks/cache/constants'
import * as postsConstants from 'store/ducks/posts/constants'
import * as Logger from 'services/Logger'
import * as ErrorsService from 'services/Errors'
import * as UserService from 'services/User'
import * as authSelector from 'store/ducks/auth/selectors'

const BLACKLIST = [
  authConstants.AUTH_DATA_FAILURE,
  authConstants.AUTH_FLOW_FAILURE,
  authConstants.AUTH_TOKEN_FAILURE,
  authConstants.AUTH_RESET_FAILURE,
  authConstants.AUTH_PREFETCH_FAILURE,
  authConstants.AUTH_CHECK_FAILURE,
  cacheConstants.CACHE_FETCH_FAILURE,
  postsConstants.POSTS_REPORT_POST_VIEWS_FAILURE,
  usersConstants.USERS_SET_APNS_TOKEN_FAILURE,
  usersConstants.USERS_REPORT_SCREEN_VIEWS_FAILURE,
]

function* captureErrors(action) {
  try {
    const message = ErrorsService.getErrorMessage(action)
    const authUser = yield select(authSelector.authUserSelector)

    const preventShowMessage = [
      message.type === ErrorsService.TYPES.NATIVE,
      message.text === ErrorsService.MESSAGES.CANCEL_REQUEST_ON_SIGNOUT,
      BLACKLIST.includes(action.type),
      !UserService.isUserActive(authUser),
    ]

    if (preventShowMessage.includes(true)) return

    yield call(showMessage, {
      message: message.text,
      type: 'danger',
      icon: 'warning',
    })
  } catch (error) {
    Logger.captureException(error)
  }
}

export default () => [takeEvery((action) => /FAILURE$/.test(action.type), captureErrors)]
