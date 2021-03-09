import { handleActions } from 'redux-actions'
import update from 'immutability-helper'
import * as constants from 'store/ducks/signup/constants'

export const initialState = {
  signupUsername: {
    data: [],
    status: 'idle',
    payload: {},
  },
  signupPassword: {
    data: [],
    status: 'idle',
    payload: {},
  },
  signupCreate: {
    status: 'idle',
    payload: {},
  },
  signupConfirm: {
    data: [],
    status: 'idle',
    payload: {},
  },
}

/**
 *
 */
const signupUsernameRequest = (state, action) => update(state, {
  signupUsername: {
    status: { $set: 'loading' },
    payload: { $set: action.payload },
  },
})

const signupUsernameSuccess = (state, action) => update(state, {
  signupUsername: {
    data: { $set: action.payload.data },
    status: { $set: 'success' },
    payload: { $set: action.payload.payload },
  },
})

const signupUsernameFailure = (state) => update(state, {
  signupUsername: {
    status: { $set: 'failure' },
  },
})

const signupUsernameIdle = (state) => update(state, {
  signupUsername: {
    status: { $set: 'idle' },
    payload: { $set: initialState.signupUsername.payload },
  },
})

/**
 *
 */
const signupPasswordRequest = (state, action) => update(state, {
  signupPassword: {
    status: { $set: 'loading' },
    payload: { $set: action.payload },
  },
})

const signupPasswordSuccess = (state, action) => update(state, {
  signupPassword: {
    data: { $set: action.payload.data },
    status: { $set: 'success' },
    payload: { $set: action.payload.payload },
  },
})

const signupPasswordFailure = (state) => update(state, {
  signupPassword: {
    status: { $set: 'failure' },
  },
})

const signupPasswordIdle = (state) => update(state, {
  signupPassword: { $set: initialState.signupPassword },
})

/**
 *
 */
const signupCreateRequest = (state, action) => update(state, {
  signupCreate: {
    status: { $set: 'loading' },
    payload: { $merge: action.payload },
  },
})

const signupCreateSuccess = (state) => update(state, {
  signupCreate: {
    status: { $set: 'success' },
  },
})

const signupCreateFailure = (state) => update(state, {
  signupCreate: {
    status: { $set: 'failure' },
  },
})

const signupCreateIdle = (state) => update(state, {
  signupCreate: { $set: initialState.signupCreate },
})

/**
 *
 */
const signupConfirmRequest = (state, action) => update(state, {
  signupConfirm: {
    status: { $set: 'loading' },
    payload: { $set: action.payload },
  },
})

const signupConfirmSuccess = (state, action) => update(state, {
  signupConfirm: {
    data: { $set: action.payload.data },
    status: { $set: 'success' },
    payload: { $set: action.payload.payload },
  },
})

const signupConfirmFailure = (state) => update(state, {
  signupConfirm: {
    status: { $set: 'failure' },
  },
})

const signupConfirmIdle = (state) => update(state, {
  signupConfirm: {
    status: { $set: 'idle' },
    payload: { $set: initialState.signupConfirm.payload },
  },
})

export default handleActions({
  [constants.SIGNUP_USERNAME_REQUEST]: signupUsernameRequest,
  [constants.SIGNUP_USERNAME_SUCCESS]: signupUsernameSuccess,
  [constants.SIGNUP_USERNAME_FAILURE]: signupUsernameFailure,
  [constants.SIGNUP_USERNAME_IDLE]: signupUsernameIdle,

  [constants.SIGNUP_PASSWORD_REQUEST]: signupPasswordRequest,
  [constants.SIGNUP_PASSWORD_SUCCESS]: signupPasswordSuccess,
  [constants.SIGNUP_PASSWORD_FAILURE]: signupPasswordFailure,
  [constants.SIGNUP_PASSWORD_IDLE]: signupPasswordIdle,

  [constants.SIGNUP_CREATE_REQUEST]: signupCreateRequest,
  [constants.SIGNUP_CREATE_SUCCESS]: signupCreateSuccess,
  [constants.SIGNUP_CREATE_FAILURE]: signupCreateFailure,
  [constants.SIGNUP_CREATE_IDLE]: signupCreateIdle,

  [constants.SIGNUP_CONFIRM_REQUEST]: signupConfirmRequest,
  [constants.SIGNUP_CONFIRM_SUCCESS]: signupConfirmSuccess,
  [constants.SIGNUP_CONFIRM_FAILURE]: signupConfirmFailure,
  [constants.SIGNUP_CONFIRM_IDLE]: signupConfirmIdle,
}, initialState)
