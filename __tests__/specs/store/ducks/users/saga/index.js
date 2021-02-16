import { expectSaga } from 'redux-saga-test-plan'
import { testEntitiesMerge, testAsRootSaga } from 'tests/utils/helpers'
import * as usersActions from 'store/ducks/users/actions'
import * as queries from 'store/ducks/users/queries'
import users from 'store/ducks/users/saga'
import * as queryService from 'services/Query'

jest.mock('store/ducks/users/saga/usersCheckPermissions', () => jest.fn())
jest.mock('services/Query', () => ({ apiRequest: jest.fn().mockResolvedValue(true) }))

const saga = () => expectSaga(testAsRootSaga(users))

describe('Users saga', () => {
  afterEach(() => {
    queryService.apiRequest.mockClear()
  })

  describe('usersSearchRequest', () => {
    it('success', async () => {
      const payload = { userId: 'id123' }
      const response = { data: { searchUsers: { items: [{ userId: 1 }] } } }
      const entities = { users: { 1: { userId: 1 } } }

      queryService.apiRequest.mockResolvedValueOnce(response)

      await testEntitiesMerge(saga(), entities)
        .put(usersActions.usersSearchSuccess({ data: [1], payload, meta: {} }))

        .dispatch(usersActions.usersSearchRequest(payload))
        .silentRun()

      expect(queryService.apiRequest).toHaveBeenCalledWith(queries.searchUsers, payload)
    })
  })

  describe('usersDeleteRequest', () => {
    it('success', async () => {
      const payload = { userId: 'id123' }
      const response = { data: { deleteUser: { userId: 1 } } }
      const entities = { users: { 1: { userId: 1 } } }

      queryService.apiRequest.mockResolvedValueOnce(response)

      await testEntitiesMerge(saga(), entities)
        .put(usersActions.usersDeleteSuccess({ data: 1, payload, meta: {} }))

        .dispatch(usersActions.usersDeleteRequest(payload))
        .silentRun()

      expect(queryService.apiRequest).toHaveBeenCalledWith(queries.deleteUser, payload)
    })
  })

  describe('usersGetFollowerUsersRequest', () => {
    it('success', async () => {
      const payload = { userId: 'id123' }
      const response = { data: { user: { followerUsers: { items: [{ userId: 1 }] } } } }
      const entities = { users: { 1: { userId: 1 } } }

      queryService.apiRequest.mockResolvedValueOnce(response)

      await testEntitiesMerge(saga(), entities)
        .put(usersActions.usersGetFollowerUsersSuccess({ data: [1], payload, meta: {} }))

        .dispatch(usersActions.usersGetFollowerUsersRequest(payload))
        .silentRun()

      expect(queryService.apiRequest).toHaveBeenCalledWith(queries.getFollowerUsers, payload)
    })
  })

  describe('usersGetFollowedUsersRequest', () => {
    it('success', async () => {
      const payload = { userId: 'id123' }
      const response = { data: { user: { followedUsers: { items: [{ userId: 1 }] } } } }
      const entities = { users: { 1: { userId: 1 } } }

      queryService.apiRequest.mockResolvedValueOnce(response)

      await testEntitiesMerge(saga(), entities)
        .put(usersActions.usersGetFollowedUsersSuccess({ data: [1], payload, meta: {} }))

        .dispatch(usersActions.usersGetFollowedUsersRequest(payload))
        .silentRun()

      expect(queryService.apiRequest).toHaveBeenCalledWith(queries.getFollowedUsers, payload)
    })
  })

  describe('usersGetPendingFollowersRequest', () => {
    it('success', async () => {
      const payload = { userId: 'id123' }
      const response = { data: { user: { followerUsers: { items: [{ userId: 1 }] } } } }
      const entities = { users: { 1: { userId: 1 } } }

      queryService.apiRequest.mockResolvedValueOnce(response)

      await testEntitiesMerge(saga(), entities)
        .put(usersActions.usersGetPendingFollowersSuccess({ data: [1], payload, meta: {} }))

        .dispatch(usersActions.usersGetPendingFollowersRequest(payload))
        .silentRun()

      expect(queryService.apiRequest).toHaveBeenCalledWith(queries.getFollowerUsers, {
        ...payload,
        followStatus: 'REQUESTED',
      })
    })
  })

  describe('usersGetFollowedUsersWithStoriesRequest', () => {
    it('success', async () => {
      const payload = { userId: 'id123' }
      const response = { data: { self: { followedUsersWithStories: { items: [{ userId: 1 }] } } } }
      const entities = { users: { 1: { userId: 1 } } }

      queryService.apiRequest.mockResolvedValueOnce(response)

      await testEntitiesMerge(saga(), entities)
        .put(usersActions.usersGetFollowedUsersWithStoriesSuccess({ data: [1], payload, meta: {} }))

        .dispatch(usersActions.usersGetFollowedUsersWithStoriesRequest(payload))
        .silentRun()

      expect(queryService.apiRequest).toHaveBeenCalledWith(queries.getFollowedUsersWithStories, payload)
    })
  })

  describe('usersAcceptFollowerUserRequest', () => {
    it('success', async () => {
      const payload = { userId: 'id123' }
      const response = { data: { acceptFollowerUser: { userId: 1 } } }
      const entities = { users: { 1: { userId: 1 } } }

      queryService.apiRequest.mockResolvedValueOnce(response)

      await testEntitiesMerge(saga(), entities)
        .put(usersActions.usersAcceptFollowerUserSuccess({ data: 1, payload, meta: {} }))

        .dispatch(usersActions.usersAcceptFollowerUserRequest(payload))
        .silentRun()

      expect(queryService.apiRequest).toHaveBeenCalledWith(queries.acceptFollowerUser, payload)
    })
  })

  describe('usersDeclineFollowerUserRequest', () => {
    it('success', async () => {
      const payload = { userId: 'id123' }
      const response = { data: { denyFollowerUser: { userId: 1 } } }
      const entities = { users: { 1: { userId: 1 } } }

      queryService.apiRequest.mockResolvedValueOnce(response)

      await testEntitiesMerge(saga(), entities)
        .put(usersActions.usersDeclineFollowerUserSuccess({ data: 1, payload, meta: {} }))

        .dispatch(usersActions.usersDeclineFollowerUserRequest(payload))
        .silentRun()

      expect(queryService.apiRequest).toHaveBeenCalledWith(queries.denyFollowerUser, payload)
    })
  })

  describe('usersGetProfileRequest', () => {
    it('success', async () => {
      const payload = { userId: 'id123' }
      const response = { data: { user: { userId: 1 } } }
      const entities = { users: { 1: { userId: 1 } } }

      queryService.apiRequest.mockResolvedValueOnce(response)

      await testEntitiesMerge(saga(), entities)
        .put(usersActions.usersGetProfileSuccess({ data: 1, payload, meta: {} }))

        .dispatch(usersActions.usersGetProfileRequest(payload))
        .silentRun()

      expect(queryService.apiRequest).toHaveBeenCalledWith(queries.user, payload)
    })
  })

  describe('usersEditProfileRequest', () => {
    it('success', async () => {
      const payload = { userId: 'id123' }
      const response = { data: { setUserDetails: { userId: 1 } } }
      const entities = { users: { 1: { userId: 1 } } }

      queryService.apiRequest.mockResolvedValueOnce(response)

      await testEntitiesMerge(saga(), entities)
        .put(usersActions.usersEditProfileSuccess({ data: 1, payload, meta: {} }))

        .dispatch(usersActions.usersEditProfileRequest(payload))
        .silentRun()

      expect(queryService.apiRequest).toHaveBeenCalledWith(queries.setUserDetails, payload)
    })
  })

  describe('usersDeleteProfilePhoto', () => {
    it('success', async () => {
      const response = { data: { setUserDetails: { userId: 1 } } }
      const entities = { users: { 1: { userId: 1 } } }

      queryService.apiRequest.mockResolvedValueOnce(response)

      await testEntitiesMerge(saga(), entities)
        .put(usersActions.usersDeleteAvatarSuccess())

        .dispatch(usersActions.usersDeleteAvatarRequest())
        .silentRun()

      expect(queryService.apiRequest).toHaveBeenCalledWith(queries.setUserDetails, { photoPostId: '' })
    })
  })

  describe('usersChangeAvatarRequest', () => {
    const postId = 1

    it('success', async () => {
      const response = { data: { setUserDetails: { userId: 1 } } }
      const entities = { users: { 1: { userId: 1 } } }

      queryService.apiRequest.mockResolvedValueOnce(response)

      await testEntitiesMerge(saga(), entities)
        .call([queryService, 'apiRequest'], queries.setUserDetails, { photoPostId: postId })
        .put(usersActions.usersChangeAvatarSuccess())

        .dispatch(usersActions.usersChangeAvatarRequest({ postId }))
        .silentRun()
    })

    it('failure', async () => {
      const nativeError = new Error('Error')
      queryService.apiRequest.mockRejectedValueOnce(nativeError)

      await expectSaga(testAsRootSaga(users))
        .call([queryService, 'apiRequest'], queries.setUserDetails, { photoPostId: postId })
        .put(usersActions.usersChangeAvatarFailure(nativeError))

        .dispatch(usersActions.usersChangeAvatarRequest({ postId: 1 }))
        .silentRun()
    })
  })

  describe('usersFollowRequest', () => {
    it('success', async () => {
      const payload = { userId: 'id123' }
      const response = { data: { followUser: { userId: 1 } } }
      const entities = { users: { 1: { userId: 1 } } }

      queryService.apiRequest.mockResolvedValueOnce(response)

      await testEntitiesMerge(saga(), entities)
        .put(usersActions.usersFollowSuccess({ data: 1, payload, meta: {} }))

        .dispatch(usersActions.usersFollowRequest(payload))
        .silentRun()

      expect(queryService.apiRequest).toHaveBeenCalledWith(queries.followUser, payload)
    })
  })

  describe('usersUnfollowRequest', () => {
    it('success', async () => {
      const payload = { userId: 'id123' }
      const response = { data: { unfollowUser: { userId: 1 } } }
      const entities = { users: { 1: { userId: 1 } } }

      queryService.apiRequest.mockResolvedValueOnce(response)

      await testEntitiesMerge(saga(), entities)
        .put(usersActions.usersUnfollowSuccess({ data: 1, payload, meta: {} }))

        .dispatch(usersActions.usersUnfollowRequest(payload))
        .silentRun()

      expect(queryService.apiRequest).toHaveBeenCalledWith(queries.unfollowUser, payload)
    })
  })

  describe('usersBlockRequest', () => {
    it('success', async () => {
      const payload = { userId: 'id123' }
      const response = { data: { blockUser: { userId: 1 } } }
      const entities = { users: { 1: { userId: 1 } } }

      queryService.apiRequest.mockResolvedValueOnce(response)

      await testEntitiesMerge(saga(), entities)
        .put(usersActions.usersBlockSuccess({ data: 1, payload, meta: {} }))

        .dispatch(usersActions.usersBlockRequest(payload))
        .silentRun()

      expect(queryService.apiRequest).toHaveBeenCalledWith(queries.blockUser, payload)
    })
  })

  describe('usersUnblockRequest', () => {
    it('success', async () => {
      const payload = { userId: 'id123' }
      const response = { data: { unblockUser: { userId: 1 } } }
      const entities = { users: { 1: { userId: 1 } } }

      queryService.apiRequest.mockResolvedValueOnce(response)

      await testEntitiesMerge(saga(), entities)
        .put(usersActions.usersUnblockSuccess({ data: 1, payload, meta: {} }))

        .dispatch(usersActions.usersUnblockRequest(payload))
        .silentRun()

      expect(queryService.apiRequest).toHaveBeenCalledWith(queries.unblockUser, payload)
    })
  })

  describe('usersGetTrendingUsersRequest', () => {
    it('success', async () => {
      const payload = { userId: 'id123' }
      const response = { data: { trendingUsers: { items: [{ userId: 1 }] } } }
      const entities = { users: { 1: { userId: 1 } } }

      queryService.apiRequest.mockResolvedValueOnce(response)

      await testEntitiesMerge(saga(), entities)
        .put(usersActions.usersGetTrendingUsersSuccess({ data: [1], payload, meta: {} }))

        .dispatch(usersActions.usersGetTrendingUsersRequest(payload))
        .silentRun()

      expect(queryService.apiRequest).toHaveBeenCalledWith(queries.trendingUsers, payload)
    })
  })
})
