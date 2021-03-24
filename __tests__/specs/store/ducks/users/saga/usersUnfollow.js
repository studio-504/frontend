import { expectSaga } from 'redux-saga-test-plan'
import users from 'store/ducks/users/saga'
import * as usersActions from 'store/ducks/users/actions'
import * as queryService from 'services/Query'
import * as queries from 'store/ducks/users/queries'
import { testEntitiesMerge, testAsRootSaga, makeAuthorizedState } from 'tests/utils/helpers'

jest.mock('services/Query', () => ({ apiRequest: jest.fn().mockResolvedValue(true) }))
const payload = { userId: 2 }
const action = usersActions.usersUnfollowRequest(payload)
const authUser = { userId: 1, userStatus: 'ACTIVE' }

describe('usersUnfollow', () => {
  afterEach(() => {
    queryService.apiRequest.mockClear()
  })

  it('success', async () => {
    const unfollowUser = { userId: 1, b: 2 }
    const response = { data: { unfollowUser } }
    const entities = { users: { 1: unfollowUser } }

    queryService.apiRequest.mockResolvedValueOnce(response)

    const saga = expectSaga(testAsRootSaga(users)).withState(makeAuthorizedState(authUser))

    await testEntitiesMerge(saga, entities)
      .put(usersActions.usersUnfollowSuccess({ data: 1, payload, meta: {} }))

      .dispatch(action)
      .silentRun()

    expect(queryService.apiRequest).toHaveBeenCalledWith(queries.unfollowUser, payload)
  })

  it('catch an error', async () => {
    const error = new Error('Fetch Error')

    queryService.apiRequest.mockRejectedValueOnce(error)

    await expectSaga(testAsRootSaga(users))
      .withState(makeAuthorizedState(authUser))
      .put(usersActions.usersUnfollowFailure(error, payload))

      .dispatch(action)
      .silentRun()
  })
})
