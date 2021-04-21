import { put, call, takeEvery } from 'redux-saga/effects'
import * as actions from 'store/ducks/auth/actions'
import * as constants from 'store/ducks/auth/constants'
import authorize, { currentUserCredentials } from 'store/ducks/auth/saga/authorize'

function* handleAuthFlowRequest() {
  const currentCredentials = yield call(currentUserCredentials)

  if (currentCredentials.authenticated) {
    yield call(authorize)
  } else {
    throw new Error('Failed to authorize')
  }
}

function* authFlowRequest() {
  try {
    yield handleAuthFlowRequest()
    yield put(actions.authFlowSuccess())
  } catch (error) {
    yield put(actions.authFlowFailure(error))
  }
}

export default () => [takeEvery(constants.AUTH_FLOW_REQUEST, authFlowRequest)]
