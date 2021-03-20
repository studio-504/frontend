import { put } from 'redux-saga/effects'
import path from 'ramda/src/path'
import * as actions from 'store/ducks/users/actions'
import * as queries from 'store/ducks/users/queries'
import * as queryService from 'services/Query'
import * as normalizer from 'normalizer/schemas'
import { entitiesMerge } from 'store/ducks/entities/saga'

/**
 *
 */
function* usersGetProfileSelfRequestData(api) {
  const dataSelector = path(['data', 'self'])
  const data = dataSelector(api)
  const normalized = normalizer.normalizeUserGet(data)

  yield entitiesMerge(normalized)

  return {
    data: normalized.result,
  }
}

function* usersGetProfileSelfRequest() {
  try {
    const data = yield queryService.apiRequest(queries.self)
    const next = yield usersGetProfileSelfRequestData(data)
    yield put(actions.usersGetProfileSelfSuccess({ data: next.data }))
  } catch (error) {
    yield put(actions.usersGetProfileSelfFailure(error))
  }
}

export default usersGetProfileSelfRequest
