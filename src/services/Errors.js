import pathOr from 'ramda/src/pathOr'

export const MESSAGES = {
  CANCEL_REQUEST_ON_SIGNOUT: 'Cancel request on signout',
  DEFAULT: 'Oops! Something went wrong',
}

export const getErrorMessage = (action) => {
  const message = pathOr(MESSAGES.DEFAULT, ['payload', 'message'], action)

  if (typeof message === 'string') {
    return message
  } else {
    return pathOr(MESSAGES.DEFAULT, ['text'], message)
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
