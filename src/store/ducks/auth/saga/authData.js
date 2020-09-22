import { call, put, takeEvery } from 'redux-saga/effects'
import * as actions from 'store/ducks/auth/actions'
import * as constants from 'store/ducks/auth/constants'
import * as errors from 'store/ducks/auth/errors'
import * as queries from 'store/ducks/auth/queries'
import * as queryService from 'services/Query'
import {
  getAuthUserPersist,
  saveAuthUserPersist,
} from 'services/Auth'

import * as entitiesActions from 'store/ducks/entities/actions'
import * as normalizer from 'normalizer/schemas'
import path from 'ramda/src/path'

class MissingUserAttributeError extends Error {
  constructor(...args) {
    super(...args)
    this.code = 'MISSING_USER_ATTRIBUTEE_ERROR'
  }
}

/**
 * Spread user data through normalized reducers
 */
export function* handleAuthFlowRequestData(req, api) {
  const dataSelector = path(['data', 'self'])

  const data = dataSelector(api)
  const meta = req.meta || {}
  const payload = req.payload || {}

  const normalized = normalizer.normalizeUserGet(data)
  yield put(entitiesActions.entitiesAlbumsMerge({ data: normalized.entities.albums || {} }))
  yield put(entitiesActions.entitiesPostsMerge({ data: normalized.entities.posts || {} }))
  yield put(entitiesActions.entitiesUsersMerge({ data: normalized.entities.users || {} }))
  yield put(entitiesActions.entitiesCommentsMerge({ data: normalized.entities.comments || {} }))
  yield put(entitiesActions.entitiesImagesMerge({ data: normalized.entities.images || {} }))

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

  if (!response.data.self.userId) {
    throw new MissingUserAttributeError()
  }

  return response
}

/**
 * Fetch cached data from asyncstorage
 */
function* offlineData() {
  const response = yield getAuthUserPersist()

  if (!response.data.self.userId) {
    throw new MissingUserAttributeError()
  }

  return response
}

function* handleAuthFlowRequest() {
  try {
    const data = yield call(onlineData)
    const next = yield call(handleAuthFlowRequestData, { meta: { type: 'ONLINE' } }, data)
    return next
  } catch (error) {
    const data = yield call(offlineData)
    const next = yield call(handleAuthFlowRequestData, { meta: { type: 'OFFLINE' } }, data)
    return next
  }
}

/**
 * Conditional user data fetching with online/offline support
 */
function* authDataRequest(req) {
  try {
    const { data, meta } = yield handleAuthFlowRequest(req.payload)
    yield put(actions.authDataSuccess({
      message: errors.getMessagePayload(constants.AUTH_FLOW_SUCCESS, 'GENERIC'),
      data,
      meta,
    }))
  } catch (error) {
    yield put(actions.authDataFailure({
      message: errors.getMessagePayload(constants.AUTH_FLOW_FAILURE, 'GENERIC', error.message),
      data: {},
      meta: {},
    }))
  }
}

export default () => [
  takeEvery(constants.AUTH_DATA_REQUEST, authDataRequest),
]