import { put, takeLatest } from 'redux-saga/effects'
import * as constants from 'store/ducks/appState/constants'
import * as authActions from 'store/ducks/auth/actions'
import * as subscriptionsActions from 'store/ducks/subscriptions/actions'

function* appStateForeground() {
  yield put(authActions.authPrefetchRequest())
}

function* appStateBackground() {
  yield put(subscriptionsActions.subscriptionsMainIdle())
  yield put(subscriptionsActions.subscriptionsPollIdle())
}

export default () => [
  takeLatest(constants.APP_STATE_FOREGROUND, appStateForeground),
  takeLatest(constants.APP_STATE_BACKGROUND, appStateBackground),
]
