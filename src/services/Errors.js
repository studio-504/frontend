import path from 'ramda/src/path'
import { createAction } from 'redux-actions'

export const MESSAGES = {
  CANCEL_REQUEST_ON_SIGNOUT: 'Cancel request on signout',
  DEFAULT: 'Oops! Something went wrong',
  USER_IS_NOT_ACTIVE: 'User is not ACTIVE',
  NETWORK_ERROR: 'Network Error',
}

export const TYPES = {
  NATIVE: 'NATIVE',
  CUSTOM: 'CUSTOM',
  DEFAULT: 'DEFAULT',
}

export const getErrorMessage = (action) => {
  const message = path(['payload', 'message'], action)

  if (typeof message === 'string') {
    return {
      type: TYPES.NATIVE,
      text: message,
    }
  } else if (typeof path(['text'], message) === 'string') {
    return {
      type: TYPES.CUSTOM,
      text: message.text,
    }
  } else {
    return {
      type: TYPES.DEFAULT,
      text: MESSAGES.DEFAULT,
    }
  }
}

export const createFailureAction = (type) =>
  createAction(
    type,
    (payload) => payload,
    (error, meta) => meta,
  )
