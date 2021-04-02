import { call } from 'redux-saga/effects'
import { showMessage } from 'react-native-flash-message'
import path from 'ramda/src/path'
import * as Logger from 'services/Logger'
import messages from 'store/messages'

const getMessageCode = path(['meta', 'messageCode'])

export default function* captureSuccess(action) {
  try {
    const message = path([action.type, getMessageCode(action), 'text'], messages)

    if (!message) return

    yield call(showMessage, {
      type: 'success',
      icon: 'success',
      message,
    })
  } catch (error) {
    Logger.captureException(error)
  }
}
