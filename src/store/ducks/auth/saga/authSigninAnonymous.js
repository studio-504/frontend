import { take, race, put, takeEvery } from 'redux-saga/effects'
import * as actions from 'store/ducks/auth/actions'
import * as constants from 'store/ducks/auth/constants'

/** 
 * Fetching cognito credentials/tokens
 */
function* handleAuthSigninAnonymousRequest() {
  yield put(actions.authFlowRequest({ allowAnonymous: true }))
  const { flowSuccess, flowFailure } = yield race({
    flowSuccess: take(constants.AUTH_FLOW_SUCCESS),
    flowFailure: take(constants.AUTH_FLOW_FAILURE),
  })

  if (flowFailure) {
    throw new Error('Failed to obtain flow')
  }

  return flowSuccess
}

/**
 *
 */
function* authSigninAnonymousRequest() {
  try {
    const data = yield handleAuthSigninAnonymousRequest()
    yield put(actions.authSigninAnonymousSuccess({ data }))
  } catch (error) {
    if (error.message && error.message.includes('The user canceled the sign in request')) {
      yield put(actions.authSigninAnonymousFailure(error, { messageCode: 'CANCELED' }))
    } else {
      yield put(actions.authSigninAnonymousFailure(error))
    }
  }
}

export default () => [
  takeEvery(constants.AUTH_SIGNIN_ANONYMOUS_REQUEST, authSigninAnonymousRequest),
] 