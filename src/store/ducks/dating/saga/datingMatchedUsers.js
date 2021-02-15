import { put, takeLatest } from 'redux-saga/effects'
import path from 'ramda/src/path'
import compose from 'ramda/src/compose'
import omit from 'ramda/src/omit'
import * as actions from 'store/ducks/dating/actions'
import * as queries from 'store/ducks/dating/queries'
import * as constants from 'store/ducks/dating/constants'
import * as queryService from 'services/Query'
import { entitiesMerge } from 'store/ducks/entities/saga'
import * as normalizer from 'normalizer/schemas'
import * as ErrorsService from 'services/Errors'

/**
 *
 */
function* datingMatchedUsersRequestData(req, api) {
  const dataSelector = path(['data', 'self', 'matchedUsers', 'items'])
  const metaSelector = compose(omit(['items']), path(['data', 'self', 'matchedUsers']))

  const data = dataSelector(api)
  const meta = metaSelector(api)
  const payload = req.payload

  const normalized = normalizer.normalizeUsersGet(data)
  yield entitiesMerge(normalized)

  return {
    data: normalized.result,
    meta,
    payload,
  }
}

function* datingMatchedUsersRequest(req) {
  try {
    const data = yield queryService.apiRequest(queries.matchedUsers, req.payload)
    const next = yield datingMatchedUsersRequestData(req, data)
    yield put(actions.datingMatchedUsersSuccess({ data: next.data, payload: next.payload, meta: next.meta }))
  } catch (error) {
    yield put(actions.datingMatchedUsersFailure({ payload: req.payload, message: ErrorsService.errorWrapper(error) }))
  }
}

export default () => [
  takeLatest(constants.DATING_MATCHED_USERS_REQUEST, datingMatchedUsersRequest),
]