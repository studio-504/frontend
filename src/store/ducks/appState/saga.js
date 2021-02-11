import { put, takeLatest } from 'redux-saga/effects'
import * as constants from 'store/ducks/appState/constants'
import * as authActions from 'store/ducks/auth/actions'
import * as subscriptionsActions from 'store/ducks/subscriptions/actions'
import * as updatesActions from 'store/ducks/updates/actions'

function* appStateLaunched() {
  yield put(updatesActions.updatesCheckRequest())
  yield put(authActions.authFlowRequest({ allowAnonymous: false }))
}

function* appStateForeground() {
  yield put(updatesActions.updatesCheckRequest())
  yield put(authActions.authPrefetchRequest())
}

function* appStateBackground() {
  yield put(subscriptionsActions.subscriptionsMainIdle())
  yield put(subscriptionsActions.subscriptionsPollIdle())
}

export default () => [
  takeLatest(constants.APP_STATE_LAUNCHED, appStateLaunched),
  takeLatest(constants.APP_STATE_FOREGROUND, appStateForeground),
  takeLatest(constants.APP_STATE_BACKGROUND, appStateBackground),
]
