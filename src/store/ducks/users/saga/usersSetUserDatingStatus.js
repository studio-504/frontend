import { put } from 'redux-saga/effects'
import path from 'ramda/src/path'
import * as actions from 'store/ducks/users/actions'
import * as queries from 'store/ducks/users/queries'
import * as constants from 'store/ducks/users/constants'
import * as queryService from 'services/Query'
import * as errors from 'store/ducks/users/errors'
import * as normalizer from 'normalizer/schemas'
import { entitiesMerge } from 'store/ducks/entities/saga'

/**
 *
 */
function* usersSetUserDatingStatusRequestData(req, api) {
  const dataSelector = path(['data', 'setUserDatingStatus'])

  const data = dataSelector(api)
  const payload = req.payload

  const normalized = normalizer.normalizeUserGet(data)
  yield entitiesMerge(normalized)

  return {
    data: normalized.result,
    payload,
  }
}

function* usersSetUserDatingStatusRequest(req) {
  try {
    const data = yield queryService.apiRequest(queries.setUserDatingStatus, req.payload)
    const next = yield usersSetUserDatingStatusRequestData(req, data)
    yield put(actions.usersSetUserDatingStatusSuccess({ data: next.data, payload: next.payload }))
  } catch (error) {
    yield put(
      actions.usersSetUserDatingStatusFailure({
        message: errors.getMessagePayload(constants.USERS_SET_USER_DATING_STATUS_FAILURE, 'GENERIC', error.message),
        payload: req.payload,
      }),
    )
  }
}

export default usersSetUserDatingStatusRequest
