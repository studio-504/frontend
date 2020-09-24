import { handleActions } from 'redux-actions'
import update from 'immutability-helper'
import * as constants from 'store/ducks/app/constants'

const initialState = {
  /**
   *
   */
  appReady: {
    data: [],
    status: 'idle',
    error: {},
    payload: {},
    meta: {},
  },
}

/**
 *
 */
const appReadyRequest = (state) => update(state, {
  appReady: {
    status: { $set: 'loading' },
  },
})

const appReadySuccess = (state, action) => update(state, {
  user: {
    $set: action.payload.data,
  },
  appReady: {
    data: { $set: action.payload.data },
    status: { $set: 'success' },
    error: { $set: initialState.appReady.error },
    payload: {},
    meta: { $set: action.payload.meta },
  },
})

const appReadyFailure = (state, action) => update(state, {
  appReady: {
    data: { $set: initialState.appReady.data },
    status: { $set: 'failure' },
    error: { $set: action.payload.message },
    payload: {},
    meta: { $set: action.payload.meta },
  },
})

const appReadyIdle = (state) => update(state, {
  appReady: { $set: initialState.appReady },
})

export default handleActions({
  [constants.APP_READY_REQUEST]: appReadyRequest,
  [constants.APP_READY_SUCCESS]: appReadySuccess,
  [constants.APP_READY_FAILURE]: appReadyFailure,
  [constants.APP_READY_IDLE]: appReadyIdle,
}, initialState)
