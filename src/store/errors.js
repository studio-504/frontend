export class AppleCredentialsError extends Error {
  constructor(...args) {
    super(...args)
    this.code = 'APPLE_CREDENTIALS_ERROR'
  }
}

export class CancelRequestOnSignoutError extends Error {
  constructor(...args) {
    super(...args)
    this.code = 'CANCEL_REQUEST_ON_SIGNOUT_ERROR'
  }
}

export class NotSupportedInAppCardError extends Error {
  constructor(...args) {
    super(...args)
    this.code = 'NOT_SUPPORTED_IN_APP_CARD_ERROR'
  }
}

export class TokenExpiredError extends Error {
  constructor(...args) {
    super(...args)
    this.code = 'TOKEN_EXPIRED'
  }
}

export class MissingUserAttributeError extends Error {
  constructor(...args) {
    super(...args)
    this.code = 'MISSING_USER_ATTRIBUTEE_ERROR'
  }
}

export class GuestUserError extends Error {
  constructor(...args) {
    super(...args)
    this.code = 'GUEST_USER_ERROR'
  }
}

export class MissingCognitoTokenError extends Error {
  constructor(...args) {
    super(...args)
    this.code = 'MISSING_COGNITO_TOKEN_ERROR'
  }
}

export class UnauthorizedTokenError extends Error {
  constructor(...args) {
    super(...args)
    this.code = 'UNAUTHORIZED_TOKEN_ERROR'
  }
}
