import { takeEvery, put, call } from 'redux-saga/effects'
import * as constants from 'store/ducks/push/constants'
import * as actions from 'store/ducks/push/actions'
import * as queries from 'store/ducks/push/queries'
import * as queryService from 'services/Query'

/**
 *
 */
function* pushSetApnsTokenRequest(req) {
  try {
    yield call([queryService, 'apiRequest'], queries.setUserAPNSToken, req.payload)
    yield put(actions.pushSetApnsTokenSuccess())
  } catch (error) {
    yield put(actions.pushSetApnsTokenFailure(error))
  }
}

export default () => [takeEvery(constants.PUSH_SET_APNS_TOKEN_REQUEST, pushSetApnsTokenRequest)]
