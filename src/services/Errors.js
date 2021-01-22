import path from 'ramda/src/path'

export const MESSAGES = {
  CANCEL_REQUEST_ON_SIGNOUT: 'Cancel request on signout',
  DEFAULT: 'Oops! Something went wrong',
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

const CODES = {
  CANCEL_REQUEST_ON_SIGNOUT_ERROR: 'CANCEL_REQUEST_ON_SIGNOUT_ERROR',
  NOT_SUPPORTED_IN_APP_CARD_ERROR: 'NOT_SUPPORTED_IN_APP_CARD_ERROR',
}

export class CancelRequestOnSignoutError extends Error {
  constructor(...args) {
    super(...args)
    this.code = CODES.CANCEL_REQUEST_ON_SIGNOUT_ERROR
  }
}

export class NotSupportedInAppCardError extends Error {
  constructor(...args) {
    super(...args)
    this.code = CODES.NOT_SUPPORTED_IN_APP_CARD_ERROR
  }
}
