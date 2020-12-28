import { takeEvery, call } from 'redux-saga/effects'
import { showMessage } from 'react-native-flash-message'
import * as authConstants from 'store/ducks/auth/constants'
import * as Logger from 'services/Logger'
import { getErrorMessage } from 'services/Errors'

const BLACKLIST = [authConstants.AUTH_DATA_FAILURE, authConstants.AUTH_FLOW_FAILURE]

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
