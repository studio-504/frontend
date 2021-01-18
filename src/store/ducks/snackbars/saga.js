import { takeEvery, call } from 'redux-saga/effects'
import { showMessage } from 'react-native-flash-message'
import * as authConstants from 'store/ducks/auth/constants'
import * as usersConstants from 'store/ducks/users/constants'
import * as cacheConstants from 'store/ducks/cache/constants'
import * as postsConstants from 'store/ducks/posts/constants'
import * as Logger from 'services/Logger'
import { getErrorMessage } from 'services/Errors'

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
    if (BLACKLIST.includes(action.type)) return

    yield call(showMessage, {
      message: getErrorMessage(action),
      type: 'danger',
      icon: 'warning',
    })
  } catch (error) {
    Logger.captureException(error)
  }
}

export default () => [takeEvery((action) => /FAILURE$/.test(action.type), captureErrors)]
