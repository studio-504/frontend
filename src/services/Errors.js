const CODES = {
  CANCEL_REQUEST_ON_SIGNOUT_ERROR: 'CANCEL_REQUEST_ON_SIGNOUT_ERROR',
}

export class CancelRequestOnSignoutError extends Error {
  constructor(...args) {
    super(...args)
    this.code = CODES.CANCEL_REQUEST_ON_SIGNOUT_ERROR
  }
}
