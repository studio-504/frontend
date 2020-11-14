import { put, getContext } from 'redux-saga/effects'
import path from 'ramda/src/path'
import * as actions from 'store/ducks/users/actions'
import * as queries from 'store/ducks/users/queries'
import * as queryService from 'services/Query'
import * as entitiesActions from 'store/ducks/entities/actions'
import * as normalizer from 'normalizer/schemas'

/**
 *
 */
function* usersGetProfileSelfRequestData(api) {
  const dataSelector = path(['data', 'self'])
  const data = dataSelector(api)
  const normalized = normalizer.normalizeUserGet(data)

  yield put(entitiesActions.entitiesAlbumsMerge({ data: normalized.entities.albums || {} }))
  yield put(entitiesActions.entitiesPostsMerge({ data: normalized.entities.posts || {} }))
  yield put(entitiesActions.entitiesUsersMerge({ data: normalized.entities.users || {} }))
  yield put(entitiesActions.entitiesCommentsMerge({ data: normalized.entities.comments || {} }))
  yield put(entitiesActions.entitiesImagesMerge({ data: normalized.entities.images || {} }))

  return {
    data: normalized.result,
  }
}

function* usersGetProfileSelfRequest() {
  const errorWrapper = yield getContext('errorWrapper')

  try {
    const data = yield queryService.apiRequest(queries.self)
    const next = yield usersGetProfileSelfRequestData(data)
    yield put(actions.usersGetProfileSelfSuccess({ data: next.data })) 
  } catch (error) {
    yield put(actions.usersGetProfileSelfFailure({ message: errorWrapper(error) }))
  }
}

export default usersGetProfileSelfRequest