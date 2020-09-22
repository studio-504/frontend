import { put, take, race, takeEvery } from 'redux-saga/effects'
import * as actions from 'store/ducks/auth/actions'
import * as constants from 'store/ducks/auth/constants'
import * as errors from 'store/ducks/auth/errors'
import pathOr from 'ramda/src/pathOr'

function hasAuthenticatedCondition({ tokenSuccess, dataSuccess }) {
  const authenticated = (
    pathOr('', ['payload', 'meta', 'type'])(tokenSuccess) === 'COGNITO_AUTHENTICATED' &&
    pathOr('', ['payload', 'data'])(dataSuccess).includes('us-east-1')
  )

  const guest = (
    pathOr('', ['payload', 'meta', 'type'])(tokenSuccess) === 'COGNITO_GUEST' &&
    pathOr('', ['payload', 'data'])(dataSuccess).includes('us-east-1')
  )

  return (authenticated || guest)
}

function* handleAuthFlowRequest(payload) {
  /**
   * App runtime initialization
   * Fetch translation and theme from cloudflare
   */
  yield put(actions.authReadyRequest())
  const { readySuccess } = yield race({
    readySuccess: take(constants.AUTH_READY_SUCCESS),
    readyFailure: take(constants.AUTH_READY_FAILURE),
  })

  /**
   * Fetching cognito credentials/tokens
   */
  yield put(actions.authTokenRequest({ allowAnonymous: payload.allowAnonymous }))
  const { tokenSuccess, tokenFailure } = yield race({
    tokenSuccess: take(constants.AUTH_TOKEN_SUCCESS),
    tokenFailure: take(constants.AUTH_TOKEN_FAILURE),
  })

  if (tokenFailure) {
    throw new Error('Failed to obtain token')
  }

  /**
   * Fetching user data from api
   */
  yield put(actions.authDataRequest({ allowAnonymous: payload.allowAnonymous }))
  const { dataSuccess, dataFailure } = yield race({
    dataSuccess: take(constants.AUTH_DATA_SUCCESS),
    dataFailure: take(constants.AUTH_DATA_FAILURE),
  })

  if (dataFailure) {
    throw new Error('Failed to fetch data')
  }

  return {
    meta: {
      authenticated: hasAuthenticatedCondition({ tokenSuccess, dataSuccess }),
    },
    data: {
      authToken: tokenSuccess.payload,
      authData: dataSuccess.payload,
      authReady: readySuccess.payload,
    },
  }
}

/**
 * Applications main entry point, responsible for:
 * - Fetching assets such as language and translation
 * - Fetching credentials and tokens
 * - Fetching user data
 * - Fetching initial data such as feed/cards/trending
 * - Initializing subscriptions
 */
function* authFlowRequest(req) {
  try {
    const { data, meta } = yield handleAuthFlowRequest(req.payload)
    yield put(actions.authFlowSuccess({
      message: errors.getMessagePayload(constants.AUTH_FLOW_SUCCESS, 'GENERIC'),
      data,
      meta,
    }))

    /**
     * Fetching initial data such as feed/cards/trending
     */
    yield put(actions.authPrefetchRequest())
  } catch (error) {
    yield put(actions.authFlowFailure({
      message: errors.getMessagePayload(constants.AUTH_FLOW_FAILURE, 'GENERIC', error.message),
      meta: {
        authenticated: false,
        nextRoute: 'Root',
      },
    }))
  }
}

export default () => [
  takeEvery(constants.AUTH_FLOW_REQUEST, authFlowRequest),
]