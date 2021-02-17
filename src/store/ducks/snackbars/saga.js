import { Alert } from 'react-native'
import { takeEvery, call } from 'redux-saga/effects'
import { showMessage } from 'react-native-flash-message'
import Config from 'react-native-config'
import pathOr from 'ramda/src/pathOr'
import * as authConstants from 'store/ducks/auth/constants'
import * as usersConstants from 'store/ducks/users/constants'
import * as cacheConstants from 'store/ducks/cache/constants'
import * as postsConstants from 'store/ducks/posts/constants'
import authMessages from 'store/ducks/auth/messages'
import signupMessages from 'store/ducks/signup/messages'
import usersMessages from 'store/ducks/users/messages'
import datingMessages from 'store/ducks/dating/messages'
import * as Logger from 'services/Logger'
import { CancelRequestOnSignoutError, UserInNotActiveError, NetworkError, stringifyFailureAction } from 'store/errors'

const DEFAULT_CODE = 'GENERIC'
const DEFAULT_MESSAGE = 'Oops! Something went wrong'
const MESSAGES = Object.assign(authMessages, signupMessages, usersMessages, datingMessages)

const BLACKLIST = [
  authConstants.AUTH_DATA_FAILURE,
  authConstants.AUTH_FLOW_FAILURE,
  authConstants.AUTH_TOKEN_FAILURE,
  authConstants.AUTH_RESET_FAILURE,
  authConstants.AUTH_PREFETCH_FAILURE,
  cacheConstants.CACHE_FETCH_FAILURE,
  postsConstants.POSTS_REPORT_POST_VIEWS_FAILURE,
  usersConstants.USERS_SET_APNS_TOKEN_FAILURE,
  usersConstants.USERS_REPORT_SCREEN_VIEWS_FAILURE,
]

const getMessageCode = pathOr(DEFAULT_CODE, ['meta', 'messageCode'])
const getDisplayMessage = (action) => pathOr(DEFAULT_MESSAGE, [action.type, getMessageCode(action), 'text'], MESSAGES)

function filterError(action) {
  if (!action.error) {
    return true
  }

  if (action.payload instanceof CancelRequestOnSignoutError) {
    return true
  }

  if (action.payload instanceof UserInNotActiveError) {
    return true
  }

  if (action.payload instanceof NetworkError) {
    return true
  }

  return BLACKLIST.includes(action.type)
}

function* showError(action) {
  function handleErrorPress() {
    if (Config.ENVIRONMENT === 'development') {
      Alert.alert(stringifyFailureAction(action))
    }
  }

  yield call(showMessage, {
    type: 'danger',
    icon: 'warning',
    message: getDisplayMessage(action),
    onPress: handleErrorPress,
  })
}

function* captureErrors(action) {
  try {
    const skipError = yield call(filterError, action)

    if (!skipError) {
      yield call(showError, action)
    }

    Logger.captureFailureAction(action)
  } catch (error) {
    Logger.captureException(error)
  }
}

export default () => [takeEvery((action) => /FAILURE$/.test(action.type), captureErrors)]
