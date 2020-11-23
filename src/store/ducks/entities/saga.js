import { put } from 'redux-saga/effects'
import * as entitiesActions from 'store/ducks/entities/actions'

export function* entitiesMerge({ entities }) {
  yield put(entitiesActions.entitiesAlbumsMerge({ data: entities.albums || {} }))
  yield put(entitiesActions.entitiesPostsMerge({ data: entities.posts || {} }))
  yield put(entitiesActions.entitiesUsersMerge({ data: entities.users || {} }))
  yield put(entitiesActions.entitiesCommentsMerge({ data: entities.comments || {} }))
  yield put(entitiesActions.entitiesImagesMerge({ data: entities.images || {} }))
  yield put(entitiesActions.entitiesMessagesMerge({ data: entities.messages || {} }))
  yield put(entitiesActions.entitiesChatsMerge({ data: entities.chats || {} }))
}