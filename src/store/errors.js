import omit from 'ramda/src/omit'
import pathOr from 'ramda/src/pathOr'
import propOr from 'ramda/src/propOr'
import path from 'ramda/src/path'
import { createAction } from 'redux-actions'
import messages from 'store/messages'

const getFirstError = pathOr('Default Error', ['errors', 0, 'message'])

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

export class UserInNotActiveError extends Error {
  constructor(...args) {
    super(...args)
    this.code = 'USER_IS_NOT_ACTIVE'
  }
}

export class NetworkError extends Error {
  constructor(...args) {
    super(...args)
    this.code = 'NETWORK_ERROR'
  }
}

export class GraphQLError extends Error {
  constructor(args) {
    super(getFirstError(args))
    this.errors = args.errors || []
    this.code = 'GRAPHQL_ERROR'
  }
}

export const getMessageCodeFromGraphQlError = (graphqlError, key, messages) => {
  const getListOf = propOr([])
  const supportedCodes = Object.keys(messages[key] || {})

  for (let error of getListOf('errors', graphqlError)) {
    for (let messageCode of getListOf('errorInfo', error)) {
      if (typeof messageCode === 'string' && supportedCodes.includes(messageCode)) {
        return messageCode
      }
    }
  }

  return 'GENERIC'
}

export const createFailureAction = (type) =>
  createAction(
    type,
    (payload) => payload,
    (error, meta = {}) => {
      if (error instanceof GraphQLError) {
        return { ...meta, messageCode: getMessageCodeFromGraphQlError(error, type, messages) }
      } else {
        return meta
      }
    },
  )

export const stringifyFailureAction = (action) => {
  function replaceErrors(key, value) {
    if (value instanceof Error) {
      var error = {}

      Object.getOwnPropertyNames(value).forEach(function (key) {
        error[key] = value[key]
      })

      return error
    }

    return value
  }

  const payload = omit(['payload'], action)
  const error = action.payload

  return `${JSON.stringify(payload)} ${JSON.stringify(error, replaceErrors)}`
}

export const handleError = (error) => {
  /*
   * Network Error
   */
  if ([error.message, getFirstError(error)].includes('Network Error')) {
    throw new NetworkError()
  }

  /*
   * GraphQL Error
   */
  if (Array.isArray(path(['errors'])(error))) {
    throw new GraphQLError(error)
  }

  throw error
}
