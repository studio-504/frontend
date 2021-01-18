import { graphqlOperation } from '@aws-amplify/api'
import { getContext, race, take, call } from 'redux-saga/effects'
import path from 'ramda/src/path'
import * as authConstants from 'store/ducks/auth/constants'
import { CancelRequestOnSignoutError, MESSAGES } from 'services/Errors'

function* cancelRequestOnSignout(request) {
  const AwsAPI = yield getContext('AwsAPI')
  const errorMessage = MESSAGES.CANCEL_REQUEST_ON_SIGNOUT

  try {
    AwsAPI.cancel(request, errorMessage)
    throw new Error(errorMessage)
  } catch (error) {
    throw new CancelRequestOnSignoutError(errorMessage)
  }
}

export function* apiRequest(query, payload) {
  const AwsAPI = yield getContext('AwsAPI')
  const request = AwsAPI.graphql(graphqlOperation(query, payload))

  const { response, signout } = yield race({
    response: request,
    signout: take(authConstants.AUTH_SIGNOUT_REQUEST),
  })

  if (signout) {
    yield call(cancelRequestOnSignout, request)
  } else {
    return response
  }
}

export function getPrimaryGraphqlError(error) {
  const firstError = path(['errors', '0'])(error)

  if (!firstError || firstError.name !== 'GraphQLError') {
    return false
  }

  return firstError
}

export function getPrimaryClientError(error) {
  const firstError = path(['errors', '0'])(error)

  if (!firstError || firstError.errorType !== 'ClientError') {
    return false
  }

  return firstError
}
