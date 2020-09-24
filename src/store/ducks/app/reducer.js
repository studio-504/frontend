import { handleActions } from 'redux-actions'
import update from 'immutability-helper'
import * as constants from 'store/ducks/app/constants'

const initialState = {
  appReady: {
    data: [],
    status: 'idle',
    error: {},
    payload: {},
    meta: {},
  },

  appTranslation: {
    data: {
      en: {},
      de: {},
    },
    status: 'idle',
    error: {},
    payload: {},
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

/**
 *
 */
const appTranslationRequest = (state, action) => update(state, {
  appTranslation: {
    status: { $set: 'loading' },
    payload: { $set: action.payload },
  },
})

const appTranslationSuccess = (state, action) => update(state, {
  appTranslation: {
    data: { $set: action.payload.data },
    status: { $set: 'success' },
  },
})

const appTranslationFailure = (state, action) => update(state, {
  appTranslation: {
    error: { $set: action.payload.error },
    status: { $set: 'failure' },
  },
})

const appTranslationIdle = (state) => update(state, {
  appTranslation: {
    data: { $set: initialState.appTranslation.data },
    status: { $set: 'idle' },
  },
})

export default handleActions({
  [constants.APP_READY_REQUEST]: appReadyRequest,
  [constants.APP_READY_SUCCESS]: appReadySuccess,
  [constants.APP_READY_FAILURE]: appReadyFailure,
  [constants.APP_READY_IDLE]: appReadyIdle,

  [constants.APP_TRANSLATION_REQUEST]: appTranslationRequest,
  [constants.APP_TRANSLATION_SUCCESS]: appTranslationSuccess,
  [constants.APP_TRANSLATION_FAILURE]: appTranslationFailure,
  [constants.APP_TRANSLATION_IDLE]: appTranslationIdle,
}, initialState)
