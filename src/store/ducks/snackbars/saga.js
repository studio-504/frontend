import { Alert } from 'react-native'
import { takeEvery, call } from 'redux-saga/effects'
import { showMessage } from 'react-native-flash-message'
import Config from 'react-native-config'
import * as authConstants from 'store/ducks/auth/constants'
import * as usersConstants from 'store/ducks/users/constants'
import * as cacheConstants from 'store/ducks/cache/constants'
import * as postsConstants from 'store/ducks/posts/constants'
import * as Logger from 'services/Logger'
import * as ErrorsService from 'services/Errors'

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

    const preventShowMessage = [
      message.type === ErrorsService.TYPES.NATIVE,
      message.text === ErrorsService.MESSAGES.CANCEL_REQUEST_ON_SIGNOUT,
      message.text === ErrorsService.MESSAGES.USER_IS_NOT_ACTIVE,
      BLACKLIST.includes(action.type),
    ]

    if (preventShowMessage.includes(true)) return

    function onLongPress() {
      if (Config.ENVIRONMENT === 'development') {
        Alert.alert(JSON.stringify(action))
      }
    }

    yield call(showMessage, {
      message: message.text,
      type: 'danger',
      icon: 'warning',
      onLongPress,
    })
  } catch (error) {
    Logger.captureException(error)
  }
}

export default () => [takeEvery((action) => /FAILURE$/.test(action.type), captureErrors)]
