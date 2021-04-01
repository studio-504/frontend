import { put, call, takeEvery } from 'redux-saga/effects'
import * as actions from 'store/ducks/signup/actions'
import * as constants from 'store/ducks/signup/constants'
import * as queries from 'store/ducks/signup/queries'
import * as queryService from 'services/Query'
import * as authActions from 'store/ducks/auth/actions'
import forge from 'node-forge'
import Config from 'react-native-config'

/**
 *
 */
function* handleSignupPasswordRequest(payload) {
  const publicKey = forge.pki.publicKeyFromPem(Config.REAL_PUBLIC_KEY_PEM)
  const password = forge.util.encodeUtf8(payload.password)
  const encrypted = publicKey.encrypt(password, 'RSA-OAEP')
  const encryptedPassword = forge.util.encode64(encrypted)
  return yield call([queryService, 'apiRequest'], queries.setUserPassword, { encryptedPassword })
}

/**
 *
 */
function* signupPasswordRequest(req) {
  try {
    const data = yield call(handleSignupPasswordRequest, req.payload)
    yield put(actions.signupPasswordSuccess({ payload: req.payload, data }))
  } catch (error) {
    yield put(actions.signupPasswordFailure(error))
  }
}

function* signupPasswordSuccess() {
  yield put(authActions.authFlowRequest())
}

export default () => [
  takeEvery(constants.SIGNUP_PASSWORD_REQUEST, signupPasswordRequest),
  takeEvery(constants.SIGNUP_PASSWORD_SUCCESS, signupPasswordSuccess),
]
