import { call, put, takeLatest, spawn, getContext } from 'redux-saga/effects'
import * as actions from 'store/ducks/auth/actions'
import * as constants from 'store/ducks/auth/constants'
import * as queries from 'store/ducks/auth/queries'
import * as queryService from 'services/Query'
import {
  saveAuthUserPersist,
  getAuthUserPersist,
} from 'services/Auth'
import * as ErrorsService from 'services/Errors'

import * as normalizer from 'normalizer/schemas'
import * as Logger from 'services/Logger'
import path from 'ramda/src/path'
import Config from 'react-native-config'
import { entitiesMerge } from 'store/ducks/entities/saga'
import * as UserService from 'services/User'


const COGNITO_PROVIDER = `cognito-idp.${Config.AWS_COGNITO_REGION}.amazonaws.com/${Config.AWS_COGNITO_USER_POOL_ID}`

class MissingUserAttributeError extends Error {
  constructor(...args) {
    super(...args)
    this.code = 'MISSING_USER_ATTRIBUTEE_ERROR'
  }
}

class GuestUserError extends Error {
  constructor(...args) {
    super(...args)
    this.code = 'GUEST_USER_ERROR'
  }
}

export function* handleAnonymousSignin(anonymousUser) {
  const AwsAuth = yield getContext('AwsAuth')

  /**
   *
   */
  const cognito = {
    id: null,
    name: null,
    email: null,
    authProvider: 'COGNITO',
    token: anonymousUser.IdToken,
    expires_at: new Date().getTime() + (50 * 60 * 1000),
  }
  const credentials = {
    token: cognito.token,
    expires_at: cognito.expires_at,
  }
  
  yield AwsAuth.federatedSignIn(COGNITO_PROVIDER, credentials, {})
}

/**
 * Sentry logger
 */
export function* handleAuthLogger(api) {
  const dataSelector = path(['data', 'self'])

  const data = dataSelector(api)
  const authenticated = {
    id: data.userId,
    username: data.username,
    email: data.email,
  }
  yield call([Logger, 'setUser'], authenticated)
}

/**
 * Spread user data through normalized reducers
 */
export function* handleAuthDataRequestData(req, api) {
  const dataSelector = path(['data', 'self'])

  const data = dataSelector(api)
  const meta = req.meta || {}
  const payload = req.payload || {}
  const normalized = normalizer.normalizeUserGet(data)
  
  yield entitiesMerge(normalized)

  return {
    data: normalized.result,
    meta,
    payload,
  }
}

/**
 * Get user data from api and cache into asyncstorage
 */
function* onlineData() {
  const response = yield queryService.apiRequest(queries.self)
  yield saveAuthUserPersist(response)

  if (!path(['data', 'self', 'userId'])(response)) {
    throw new MissingUserAttributeError()
  }

  const next = yield call(handleAuthDataRequestData, { meta: { type: 'ONLINE' } }, response)
  yield handleAuthLogger(response)
  return next
}

/**
 *
 */
function* cachedData() {
  const response = yield getAuthUserPersist()
  const self = path(['data', 'self'], response)

  if (!path(['userId'])(self)) {
    throw new MissingUserAttributeError()
  }

  // temporary check to only return active user data
  if (!UserService.isUserActive(self)) {
    throw new GuestUserError()
  }

  const next = yield call(handleAuthDataRequestData, { meta: { type: 'OFFLINE' } }, response)
  yield handleAuthLogger(response)
  return next
}

/**
 * Handled anonymous user creation, throws an error if user already exists
 */
function* createAnonymousUser() {
  try {
    const request = yield queryService.apiRequest(queries.createAnonymousUser)
    yield call(handleAnonymousSignin, request.data.createAnonymousUser)
  } catch (error) {
    // ignore
  }
}

function* handleAuthDataRequest(payload = {}) {
  if (payload.allowAnonymous) {
    yield createAnonymousUser()
  }

  try {
    const cached = yield call(cachedData)
    yield spawn(onlineData)
    return cached
  } catch (error) {
    return yield call(onlineData)
  }
}

/**
 * Conditional user data fetching with online/offline support
 */


function* authDataRequest(req) {
  try {
    const { data, meta } = yield handleAuthDataRequest(req.payload)
    yield put(actions.authDataSuccess({
      message: ErrorsService.getMessagePayload(constants.AUTH_DATA_SUCCESS, 'GENERIC'),
      data,
      meta,
    }))
  } catch (error) {
    const primaryClientError = yield call(ErrorsService.getPrimaryClientError, error)
      
    if (primaryClientError && primaryClientError.message.includes('User does not exist')) {
      yield put(actions.authDataFailure({
        message: ErrorsService.getMessagePayload(constants.AUTH_DATA_FAILURE, 'USER_DOES_NOT_EXIST', error),
      }))
    } else {
      yield put(actions.authDataFailure({
        message: ErrorsService.getMessagePayload(constants.AUTH_DATA_FAILURE, 'GENERIC', error),
      }))
    }
  }
}

export default () => [
  takeLatest(constants.AUTH_DATA_REQUEST, authDataRequest),
]