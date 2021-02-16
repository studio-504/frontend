import { graphqlOperation } from '@aws-amplify/api'
import { getContext, race, take, call } from 'redux-saga/effects'
import * as authConstants from 'store/ducks/auth/constants'
import { MESSAGES } from 'services/Errors'
import { CancelRequestOnSignoutError } from 'store/errors'

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

export function httpRequest(url, options) {
  return fetch(url, options)
}
