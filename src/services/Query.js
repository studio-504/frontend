import { graphqlOperation } from '@aws-amplify/api'
import { getContext, race, take, call } from 'redux-saga/effects'
import * as authConstants from 'store/ducks/auth/constants'
import { CancelRequestOnSignoutError, NetworkError } from 'store/errors'

function* cancelRequestOnSignout(request) {
  const AwsAPI = yield getContext('AwsAPI')
  const errorMessage = 'Cancel Request on Signout'

  try {
    AwsAPI.cancel(request, errorMessage)
    throw new Error(errorMessage)
  } catch (error) {
    throw new CancelRequestOnSignoutError()
  }
}

export function* apiRequest(query, payload) {
  try {
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
  } catch (error) {
    if (error.message === 'Network Error') {
      throw new NetworkError()
    }

    throw error
  }
}

export function httpRequest(url, options) {
  return fetch(url, options)
}
