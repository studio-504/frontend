import { handleActions } from 'redux-actions'
import update from 'immutability-helper'
import * as constants from 'store/ducks/auth/constants'
import path from 'ramda/src/path'

const initialState = {
  /**
   *
   */
  user: {},

  /**
   *
   */
  authCheck: {
    data: [],
    status: 'idle',
    error: {},
    message: {},
    payload: {},
    nextRoute: null,
  },
  authSigninAnonymous: {
    data: [],
    status: 'idle',
    error: {},
    message: {},
    payload: {},
    nextRoute: null,
  },
  authSigninCognito: {
    data: [],
    status: 'idle',
    error: {},
    message: {},
    payload: {},
    nextRoute: null,
  },
  authSigninGoogle: {
    data: [],
    status: 'idle',
    error: {},
    message: {},
    payload: {},
    nextRoute: null,
  },
  authSigninApple: {
    data: [],
    status: 'idle',
    error: {},
    message: {},
    payload: {},
    nextRoute: null,
  },
  authSignout: {
    data: [],
    status: 'idle',
    error: {},
    message: {},
    payload: {},
    nextRoute: null,
  },
  authForgot: {
    data: [],
    status: 'idle',
    error: {},
    message: {},
    payload: {},
    nextRoute: null,
  },
  authForgotConfirm: {
    data: [],
    status: 'idle',
    error: {},
    message: {},
    payload: {},
    nextRoute: null,
  },
}

/**
 *
 */
const authCheckRequest = (state, action) => update(state, {
  authCheck: {
    status: { $set: 'loading' },
    payload: { $set: action.payload },
  },
})

const authCheckSuccess = (state, action) => update(state, {
  user: { $set: action.payload.data },
  authCheck: {
    message: { $set: action.payload.message },
    data: { $set: action.payload.data },
    status: { $set: 'success' },
    nextRoute: { $set: action.payload.nextRoute },
    meta: { $set: action.payload.meta },
  },
})

const authCheckFailure = (state, action) => update(state, {
  authCheck: {
    message: { $set: action.payload.message },
    error: { $set: action.payload.message },
    status: { $set: 'failure' },
    nextRoute: { $set: action.payload.nextRoute },
    meta: { $set: action.payload.meta },
  },
})

const authCheckIdle = (state, action) => update(state, {
  authCheck: {
    data: { $set: initialState.authCheck.data },
    status: { $set: 'idle' },
    error: { $set: initialState.authCheck.error },
    message: { $set: initialState.authCheck.message },
    nextRoute: { $set: path(['payload', 'nextRoute'])(action) || path(['authCheck', 'nextRoute'])(state) },
  },
})

const authCheckReset = (state) => update(state, {
  user: { $set: initialState.user },
})

/**
 *
 */
const authSigninCognitoRequest = (state, action) => update(state, {
  authSigninCognito: {
    status: { $set: 'loading' },
    payload: { $set: action.payload },
  },
})

const authSigninCognitoSuccess = (state, action) => update(state, {
  authSigninCognito: {
    message: { $set: action.payload.message },
    data: { $set: action.payload.data },
    status: { $set: 'success' },
    nextRoute: { $set: action.payload.nextRoute },
  },
})

const authSigninCognitoFailure = (state, action) => update(state, {
  authSigninCognito: {
    message: { $set: action.payload.message },
    error: { $set: action.payload.message },
    status: { $set: 'failure' },
    nextRoute: { $set: action.payload.nextRoute },
  },
})

const authSigninCognitoIdle = (state) => update(state, {
  authSigninCognito: {
    data: { $set: initialState.authSigninCognito.data },
    status: { $set: 'idle' },
    error: { $set: initialState.authSigninCognito.error },
    message: { $set: initialState.authSigninCognito.message },
  },
})

/**
 *
 */
const authSigninGoogleRequest = (state) => update(state, {
  authSigninGoogle: {
    status: { $set: 'loading' },
  },
})

const authSigninGoogleSuccess = (state, action) => update(state, {
  authSigninGoogle: {
    message: { $set: action.payload.message },
    data: { $set: action.payload.data },
    status: { $set: 'success' },
  },
})

const authSigninGoogleFailure = (state, action) => update(state, {
  authSigninGoogle: {
    message: { $set: action.payload.message },
    error: { $set: action.payload.message },
    status: { $set: 'failure' },
  },
})

const authSigninGoogleIdle = (state) => update(state, {
  authSigninGoogle: {
    data: { $set: initialState.authSigninGoogle.data },
    status: { $set: 'idle' },
    error: { $set: initialState.authSigninGoogle.error },
    message: { $set: initialState.authSigninGoogle.message },
  },
})

/**
 *
 */
const authSigninAppleRequest = (state) => update(state, {
  authSigninApple: {
    status: { $set: 'loading' },
  },
})

const authSigninAppleSuccess = (state, action) => update(state, {
  authSigninApple: {
    message: { $set: action.payload.message },
    data: { $set: action.payload.data },
    status: { $set: 'success' },
  },
})

const authSigninAppleFailure = (state, action) => update(state, {
  authSigninApple: {
    message: { $set: action.payload.message },
    error: { $set: action.payload.message },
    status: { $set: 'failure' },
  },
})

const authSigninAppleIdle = (state) => update(state, {
  authSigninApple: {
    data: { $set: initialState.authSigninApple.data },
    status: { $set: 'idle' },
    error: { $set: initialState.authSigninApple.error },
    message: { $set: initialState.authSigninApple.message },
  },
})

/**
 *
 */
const authSignoutRequest = (state) => update(state, {
  authSignout: {
    status: { $set: 'loading' },
  },
})

const authSignoutSuccess = (state, action) => update(initialState, {
  authCheck: {
    message: { $set: action.payload.message },
    nextRoute: { $set: 'AuthHome' },
  },
})

const authSignoutFailure = (state, action) => update(state, {
  authSignout: {
    message: { $set: action.payload.message },
    error: { $set: action.payload.message },
    status: { $set: 'failure' },
  },
})

const authSignoutIdle = (state) => update(state, {
  authSignout: {
    data: { $set: initialState.authSignout.data },
    status: { $set: 'idle' },
    error: { $set: initialState.authSignout.error },
    message: { $set: initialState.authSignout.message },
  },
})


/**
 *
 */
const authForgotRequest = (state, action) => update(state, {
  authForgot: {
    status: { $set: 'loading' },
    payload: { $set: action.payload },
  },
})

const authForgotSuccess = (state, action) => update(state, {
  authForgot: {
    message: { $set: action.payload.message },
    data: { $set: action.payload.data },
    status: { $set: 'success' },
  },
})

const authForgotFailure = (state, action) => update(state, {
  authForgot: {
    message: { $set: action.payload.message },
    error: { $set: action.payload.message },
    status: { $set: 'failure' },
  },
})

const authForgotIdle = (state) => update(state, {
  authForgot: {
    data: { $set: initialState.authForgot.data },
    status: { $set: 'idle' },
    error: { $set: initialState.authForgot.error },
    message: { $set: initialState.authForgot.message },
  },
})

/**
 *
 */
const authForgotConfirmRequest = (state) => update(state, {
  authForgotConfirm: {
    status: { $set: 'loading' },
  },
})

const authForgotConfirmSuccess = (state, action) => update(state, {
  authForgotConfirm: {
    message: { $set: action.payload.message },
    data: { $set: action.payload.data },
    status: { $set: 'success' },
  },
})

const authForgotConfirmFailure = (state, action) => update(state, {
  authForgotConfirm: {
    message: { $set: action.payload.message },
    error: { $set: action.payload.message },
    status: { $set: 'failure' },
  },
})

const authForgotConfirmIdle = (state) => update(state, {
  authForgotConfirm: {
    data: { $set: initialState.authForgotConfirm.data },
    status: { $set: 'idle' },
    error: { $set: initialState.authForgotConfirm.error },
    message: { $set: initialState.authForgotConfirm.message },
  },
})

export default handleActions({
  [constants.AUTH_CHECK_REQUEST]: authCheckRequest,
  [constants.AUTH_CHECK_SUCCESS]: authCheckSuccess,
  [constants.AUTH_CHECK_FAILURE]: authCheckFailure,
  [constants.AUTH_CHECK_IDLE]: authCheckIdle,
  [constants.AUTH_CHECK_RESET]: authCheckReset,

  [constants.AUTH_SIGNIN_COGNITO_REQUEST]: authSigninCognitoRequest,
  [constants.AUTH_SIGNIN_COGNITO_SUCCESS]: authSigninCognitoSuccess,
  [constants.AUTH_SIGNIN_COGNITO_FAILURE]: authSigninCognitoFailure,
  [constants.AUTH_SIGNIN_COGNITO_IDLE]: authSigninCognitoIdle,

  [constants.AUTH_SIGNIN_GOOGLE_REQUEST]: authSigninGoogleRequest,
  [constants.AUTH_SIGNIN_GOOGLE_SUCCESS]: authSigninGoogleSuccess,
  [constants.AUTH_SIGNIN_GOOGLE_FAILURE]: authSigninGoogleFailure,
  [constants.AUTH_SIGNIN_GOOGLE_IDLE]: authSigninGoogleIdle,

  [constants.AUTH_SIGNIN_APPLE_REQUEST]: authSigninAppleRequest,
  [constants.AUTH_SIGNIN_APPLE_SUCCESS]: authSigninAppleSuccess,
  [constants.AUTH_SIGNIN_APPLE_FAILURE]: authSigninAppleFailure,
  [constants.AUTH_SIGNIN_APPLE_IDLE]: authSigninAppleIdle,

  [constants.AUTH_SIGNOUT_REQUEST]: authSignoutRequest,
  [constants.AUTH_SIGNOUT_SUCCESS]: authSignoutSuccess,
  [constants.AUTH_SIGNOUT_FAILURE]: authSignoutFailure,
  [constants.AUTH_SIGNOUT_IDLE]: authSignoutIdle,

  [constants.AUTH_FORGOT_REQUEST]: authForgotRequest,
  [constants.AUTH_FORGOT_SUCCESS]: authForgotSuccess,
  [constants.AUTH_FORGOT_FAILURE]: authForgotFailure,
  [constants.AUTH_FORGOT_IDLE]: authForgotIdle,

  [constants.AUTH_FORGOT_CONFIRM_REQUEST]: authForgotConfirmRequest,
  [constants.AUTH_FORGOT_CONFIRM_SUCCESS]: authForgotConfirmSuccess,
  [constants.AUTH_FORGOT_CONFIRM_FAILURE]: authForgotConfirmFailure,
  [constants.AUTH_FORGOT_CONFIRM_IDLE]: authForgotConfirmIdle,
}, initialState)
