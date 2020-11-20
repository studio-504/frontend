import { expectSaga } from 'redux-saga-test-plan'
import { testEntitiesMerge, testAsRootSaga } from 'tests/utils/helpers'
import posts from 'store/ducks/posts/saga'
import * as queries from 'store/ducks/posts/queries'
import * as postsActions from 'store/ducks/posts/actions'
import * as queryService from 'services/Query'

jest.mock('store/ducks/users/saga/usersCheckPermissions', () => jest.fn())
jest.mock('services/Query', () => ({ apiRequest: jest.fn().mockResolvedValue(true) }))

const saga = () => expectSaga(testAsRootSaga(posts))

describe('Posts sagas', () => {
  afterEach(() => {
    queryService.apiRequest.mockClear()
  })

  describe('postsGetRequest', () => {
    it('success', async () => {
      const payload = { userId: 'id123' }
      const response = { data: { user: { posts: { items: [{ postId: 1 }] } } } }
      const entities = { posts: { 1: { postId: 1 } } }

      queryService.apiRequest.mockResolvedValueOnce(response)

      await testEntitiesMerge(saga(), entities)
        .put(postsActions.postsGetSuccess({ data: [1], payload, meta: {} }))

        .dispatch(postsActions.postsGetRequest(payload))
        .silentRun()

      expect(queryService.apiRequest).toHaveBeenCalledWith(queries.getPosts, { ...payload, postStatus: 'COMPLETED' })
    })
  })

  describe('postsGetMoreRequest', () => {
    it('success', async () => {
      const payload = { userId: 'id123' }
      const response = { data: { user: { posts: { items: [{ postId: 1 }] } } } }
      const entities = { posts: { 1: { postId: 1 } } }

      queryService.apiRequest.mockResolvedValueOnce(response)

      await testEntitiesMerge(saga(), entities)
        .put(postsActions.postsGetMoreSuccess({ data: [1], payload, meta: {} }))

        .dispatch(postsActions.postsGetMoreRequest(payload))
        .silentRun()

      expect(queryService.apiRequest).toHaveBeenCalledWith(queries.getPosts, { ...payload, postStatus: 'COMPLETED' })
    })
  })

  describe('postsGetUnreadCommentsRequest', () => {
    it('success', async () => {
      const payload = { userId: 'id123' }
      const response = { data: { self: { postsWithUnviewedComments: { items: [{ postId: 1 }] } } } }
      const entities = { posts: { 1: { postId: 1 } } }

      queryService.apiRequest.mockResolvedValueOnce(response)

      await testEntitiesMerge(saga(), entities)
        .put(postsActions.postsGetUnreadCommentsSuccess({ data: [1], payload, meta: {} }))

        .dispatch(postsActions.postsGetUnreadCommentsRequest(payload))
        .silentRun()

      expect(queryService.apiRequest).toHaveBeenCalledWith(queries.getPostsUnreadComments, payload)
    })
  })

  describe('postsViewsGetRequest', () => {
    it('success', async () => {
      const payload = { userId: 'id123' }
      const response = { data: { post: { viewedBy: { items: [{ userId: 1 }] } } } }
      const entities = { users: { 1: { userId: 1 } } }

      queryService.apiRequest.mockResolvedValueOnce(response)

      await testEntitiesMerge(saga(), entities)
        .put(postsActions.postsViewsGetSuccess({ data: [1], payload, meta: {} }))

        .dispatch(postsActions.postsViewsGetRequest(payload))
        .silentRun()

      expect(queryService.apiRequest).toHaveBeenCalledWith(queries.viewedBy, payload)
    })
  })

  describe('postsViewsGetMoreRequest', () => {
    it('success', async () => {
      const payload = { userId: 'id123' }
      const response = { data: { post: { viewedBy: { items: [{ userId: 1 }] } } } }
      const entities = { users: { 1: { userId: 1 } } }

      queryService.apiRequest.mockResolvedValueOnce(response)

      await testEntitiesMerge(saga(), entities)
        .put(postsActions.postsViewsGetMoreSuccess({ data: [1], payload, meta: {} }))

        .dispatch(postsActions.postsViewsGetMoreRequest(payload))
        .silentRun()

      expect(queryService.apiRequest).toHaveBeenCalledWith(queries.viewedBy, payload)
    })
  })

  describe('postsLikesGetRequest', () => {
    it('success', async () => {
      const payload = { userId: 'id123' }
      const response = { data: { post: { onymouslyLikedBy: { items: [{ userId: 1 }] } } } }
      const entities = { users: { 1: { userId: 1 } } }

      queryService.apiRequest.mockResolvedValueOnce(response)

      await testEntitiesMerge(saga(), entities)
        .put(postsActions.postsLikesGetSuccess({ data: [1], payload, meta: {} }))

        .dispatch(postsActions.postsLikesGetRequest(payload))
        .silentRun()

      expect(queryService.apiRequest).toHaveBeenCalledWith(queries.onymouslyLikedBy, payload)
    })
  })

  describe('postsFeedGetRequest', () => {
    it('success', async () => {
      const payload = { userId: 'id123' }
      const response = { data: { self: { feed: { items: [{ postId: 1 }] } } } }
      const entities = { posts: { 1: { postId: 1 } } }

      queryService.apiRequest.mockResolvedValueOnce(response)

      await testEntitiesMerge(saga(), entities)
        .put(postsActions.postsFeedGetSuccess({ data: [1], payload, meta: {} }))

        .dispatch(postsActions.postsFeedGetRequest(payload))
        .silentRun()

      expect(queryService.apiRequest).toHaveBeenCalledWith(queries.getFeed, payload)
    })
  })

  describe('postsFeedGetMoreRequest', () => {
    it('success', async () => {
      const payload = { userId: 'id123' }
      const response = { data: { self: { feed: { items: [{ postId: 1 }] } } } }
      const entities = { posts: { 1: { postId: 1 } } }

      queryService.apiRequest.mockResolvedValueOnce(response)

      await testEntitiesMerge(saga(), entities)
        .put(postsActions.postsFeedGetMoreSuccess({ data: [1], payload, meta: {} }))

        .dispatch(postsActions.postsFeedGetMoreRequest(payload))
        .silentRun()

      expect(queryService.apiRequest).toHaveBeenCalledWith(queries.getFeed, payload)
    })
  })

  describe('postsGetArchivedRequest', () => {
    it('success', async () => {
      const payload = { userId: 'id123' }
      const response = { data: { user: { posts: { items: [{ postId: 1 }] } } } }
      const entities = { posts: { 1: { postId: 1 } } }

      queryService.apiRequest.mockResolvedValueOnce(response)

      await testEntitiesMerge(saga(), entities)
        .put(postsActions.postsGetArchivedSuccess({ data: [1], payload, meta: {} }))

        .dispatch(postsActions.postsGetArchivedRequest(payload))
        .silentRun()

      expect(queryService.apiRequest).toHaveBeenCalledWith(queries.getPosts, { ...payload, postStatus: 'ARCHIVED' })
    })
  })

  describe('postsEditRequest', () => {
    it('success', async () => {
      const payload = { postId: 'id123' }
      const response = { data: { editPost: { postId: 1 } } }
      const entities = { posts: { 1: { postId: 1 } } }

      queryService.apiRequest.mockResolvedValue(response)

      await testEntitiesMerge(saga(), entities)
        .put(postsActions.postsEditSuccess({ data: 1, payload, meta: {} }))

        .dispatch(postsActions.postsEditRequest(payload))
        .silentRun()

      expect(queryService.apiRequest).toHaveBeenCalledWith(queries.editPostExpiresAt, payload)
      expect(queryService.apiRequest).toHaveBeenCalledWith(queries.editPostAlbum, payload)
      expect(queryService.apiRequest).toHaveBeenCalledWith(queries.editPost, payload)

      queryService.apiRequest.mockResolvedValue(true)
    })
  })

  describe('postsDeleteRequest', () => {
    it('success', async () => {
      const payload = { postId: 'id123', userId: 'id434' }
      const response = { data: { deletePost: { postId: 1 } } }
      const entities = { posts: { 1: { postId: 1 } } }

      queryService.apiRequest.mockResolvedValueOnce(response)
      queryService.apiRequest.mockResolvedValueOnce({ data: { user: { posts: { items: [{ postId: 1 }] } } } })

      await testEntitiesMerge(saga(), entities)
        .put(postsActions.postsDeleteSuccess({ data: 1, payload, meta: {} }))
        .put(postsActions.postsDeleteIdle({}))
        .put(postsActions.postsGetRequest({ userId: 'id434' }))
        .put(postsActions.postsGetSuccess({ data: [1], payload: { userId: 'id434' }, meta: {} }))

        .dispatch(postsActions.postsDeleteRequest(payload))
        .silentRun()

      expect(queryService.apiRequest).toHaveBeenCalledWith(queries.deletePost, payload)
    })
  })

  describe('postsArchiveRequest', () => {
    it('success', async () => {
      const payload = { postId: 'id123', userId: 'id434' }
      const response = { data: { archivePost: { postId: 1 } } }
      const entities = { posts: { 1: { postId: 1 } } }

      queryService.apiRequest.mockResolvedValueOnce(response)
      queryService.apiRequest.mockResolvedValueOnce({ data: { user: { posts: { items: [{ postId: 1 }] } } } })

      await testEntitiesMerge(saga(), entities)
        .put(postsActions.postsArchiveSuccess({ data: 1, payload, meta: {} }))
        .put(postsActions.postsArchiveIdle({}))
        .put(postsActions.postsGetRequest({ userId: 'id434' }))
        .put(postsActions.postsGetSuccess({ data: [1], payload: { userId: 'id434' }, meta: {} }))

        .dispatch(postsActions.postsArchiveRequest(payload))
        .silentRun()

      expect(queryService.apiRequest).toHaveBeenCalledWith(queries.archivePost, payload)
    })
  })

  describe('postsRestoreArchivedRequest', () => {
    it('success', async () => {
      const payload = { postId: 'id123', userId: 'id434' }
      const response = { data: { restoreArchivedPost: { postId: 1 } } }
      const entities = { posts: { 1: { postId: 1 } } }

      queryService.apiRequest.mockResolvedValueOnce(response)
      queryService.apiRequest.mockResolvedValueOnce({ data: { user: { posts: { items: [{ postId: 1 }] } } } })

      await testEntitiesMerge(saga(), entities)
        .put(postsActions.postsRestoreArchivedSuccess({ data: 1, payload, meta: {} }))
        .put(postsActions.postsRestoreArchivedIdle({}))
        .put(postsActions.postsGetRequest({ userId: 'id434' }))
        .put(postsActions.postsGetSuccess({ data: [1], payload: { userId: 'id434' }, meta: {} }))

        .dispatch(postsActions.postsRestoreArchivedRequest(payload))
        .silentRun()

      expect(queryService.apiRequest).toHaveBeenCalledWith(queries.restoreArchivedPost, payload)
    })
  })

  describe('postsFlagRequest', () => {
    it('success', async () => {
      const payload = { postId: 'id123', userId: 'id434' }
      const response = { data: { flagPost: { postId: 1 } } }
      const entities = { posts: { 1: { postId: 1 } } }

      queryService.apiRequest.mockResolvedValueOnce(response)

      await testEntitiesMerge(saga(), entities)
        .put(postsActions.postsFlagSuccess({ data: 1, payload, meta: {} }))
        .put(postsActions.postsFlagIdle({}))

        .dispatch(postsActions.postsFlagRequest(payload))
        .silentRun()

      expect(queryService.apiRequest).toHaveBeenCalledWith(queries.flagPost, payload)
    })
  })

  describe('postsSingleGetRequest', () => {
    it('success', async () => {
      const payload = { postId: 'id123', userId: 'id434' }
      const response = { data: { post: { postId: 1 } } }
      const entities = { posts: { 1: { postId: 1 } } }

      queryService.apiRequest.mockResolvedValueOnce(response)

      await testEntitiesMerge(saga(), entities)
        .put(postsActions.postsSingleGetSuccess({ data: 1, payload, meta: {} }))

        .dispatch(postsActions.postsSingleGetRequest(payload))
        .silentRun()

      expect(queryService.apiRequest).toHaveBeenCalledWith(queries.getPost, payload)
    })
  })

  describe('postsOnymouslyLikeRequest', () => {
    it('success', async () => {
      const payload = { postId: 'id123' }
      const response = { data: { onymouslyLikePost: { postId: 1 } } }
      const entities = { posts: { 1: { postId: 1 } } }

      queryService.apiRequest.mockResolvedValueOnce(response)

      await testEntitiesMerge(saga(), entities)
        .put(postsActions.postsOnymouslyLikeSuccess({ data: 1, payload, meta: {} }))

        .dispatch(postsActions.postsOnymouslyLikeRequest(payload))
        .silentRun()

      expect(queryService.apiRequest).toHaveBeenCalledWith(queries.onymouslyLikePost, payload)
    })
  })

  describe('postsDislikeRequest', () => {
    it('success', async () => {
      const payload = { postId: 'id123' }
      const response = { data: { dislikePost: { postId: 1 } } }
      const entities = { posts: { 1: { postId: 1 } } }

      queryService.apiRequest.mockResolvedValueOnce(response)

      await testEntitiesMerge(saga(), entities)
        .put(postsActions.postsDislikeSuccess({ data: 1, payload, meta: {} }))

        .dispatch(postsActions.postsDislikeRequest(payload))
        .silentRun()

      expect(queryService.apiRequest).toHaveBeenCalledWith(queries.dislikePost, payload)
    })
  })

  describe('postsCommentsGetRequest', () => {
    it('success', async () => {
      const payload = { postId: 'id123' }
      const response = { data: { post: { comments: { items: [{ commentId: 1 }] } } } }
      const entities = { comments: { 1: { commentId: 1 } } }

      queryService.apiRequest.mockResolvedValueOnce(response)

      await testEntitiesMerge(saga(), entities)
        .put(postsActions.postsCommentsGetSuccess({ data: [1], payload, meta: {} }))

        .dispatch(postsActions.postsCommentsGetRequest(payload))
        .silentRun()

      expect(queryService.apiRequest).toHaveBeenCalledWith(queries.comments, payload)
    })
  })

  describe('commentsAddRequest', () => {
    it('success', async () => {
      const payload = { postId: 'id123' }
      const response = { data: { addComment: { commentId: 1 } } }

      queryService.apiRequest.mockResolvedValueOnce(response)

      await testEntitiesMerge(saga(), {})
        .put(postsActions.commentsAddSuccess({ data: [1], payload, meta: {} }))

        .dispatch(postsActions.commentsAddRequest(payload))
        .silentRun()

      expect(queryService.apiRequest).toHaveBeenCalledWith(queries.addComment, payload)
    })
  })

  describe('commentsDeleteRequest', () => {
    it('success', async () => {
      const payload = { commentId: 'id123' }
      const response = { data: { deleteComment: { commentId: 1 } } }

      queryService.apiRequest.mockResolvedValue(response)

      await testEntitiesMerge(saga(), {})
        .put(postsActions.commentsDeleteSuccess({ data: [1], payload, meta: {} }))

        .dispatch(postsActions.commentsDeleteRequest(payload))
        .silentRun()

      expect(queryService.apiRequest).toHaveBeenCalledWith(queries.deleteComment, payload)

      queryService.apiRequest.mockResolvedValue(true)
    })
  })
})
