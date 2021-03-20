import { expectSaga } from 'redux-saga-test-plan'
import { testEntitiesMerge } from 'tests/utils/helpers'
import { entitiesMerge } from 'store/ducks/entities/saga'
import * as entitiesActions from 'store/ducks/entities/actions'

describe('Entities saga', () => {
  it('merge with empty data by default', async () => {
    const entities = {}
    const saga = () => expectSaga(entitiesMerge, { entities })

    await saga()
      .put(entitiesActions.entitiesAlbumsMerge({ data: {} }))
      .put(entitiesActions.entitiesPostsMerge({ data: {} }))
      .put(entitiesActions.entitiesUsersMerge({ data: {} }))
      .put(entitiesActions.entitiesCommentsMerge({ data: {} }))
      .put(entitiesActions.entitiesImagesMerge({ data: {} }))
      .put(entitiesActions.entitiesMessagesMerge({ data: {} }))
      .put(entitiesActions.entitiesChatsMerge({ data: {} }))

      .silentRun()

    await testEntitiesMerge(saga(), entities).silentRun()
  })

  it('merge entities', async () => {
    const entities = {
      albums: { a: 1 },
      posts: { b: 2 },
      users: { c: 3 },
      comments: { f: 4 },
      images: { g: 5 },
      messages: { k: 6 },
      chats: { p: 7 },
    }

    const saga = () => expectSaga(entitiesMerge, { entities })

    await saga()
      .put(entitiesActions.entitiesAlbumsMerge({ data: entities.albums }))
      .put(entitiesActions.entitiesPostsMerge({ data: entities.posts }))
      .put(entitiesActions.entitiesUsersMerge({ data: entities.users }))
      .put(entitiesActions.entitiesCommentsMerge({ data: entities.comments }))
      .put(entitiesActions.entitiesImagesMerge({ data: entities.images }))
      .put(entitiesActions.entitiesMessagesMerge({ data: entities.messages }))
      .put(entitiesActions.entitiesChatsMerge({ data: entities.chats }))

      .silentRun()

    await testEntitiesMerge(saga(), entities).silentRun()
  })
})
