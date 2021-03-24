import { expectSaga } from 'redux-saga-test-plan'
import users from 'store/ducks/users/saga'
import * as usersActions from 'store/ducks/users/actions'
import * as queryService from 'services/Query'
import * as queries from 'store/ducks/users/queries'
import { testEntitiesMerge, testAsRootSaga } from 'tests/utils/helpers'

jest.mock('services/Query', () => ({ apiRequest: jest.fn().mockResolvedValue(true) }))
const payload = { userId: 2 }
const action = usersActions.usersDeclineFollowerUserRequest(payload)

describe('usersDeclineFollowerUser', () => {
  afterEach(() => {
    queryService.apiRequest.mockClear()
  })

  it('success', async () => {
    const denyFollowerUser = { userId: 1, b: 2 }
    const response = { data: { denyFollowerUser } }
    const entities = { users: { 1: denyFollowerUser } }

    queryService.apiRequest.mockResolvedValueOnce(response)

    const saga = expectSaga(testAsRootSaga(users))

    await testEntitiesMerge(saga, entities)
      .put(usersActions.usersDeclineFollowerUserSuccess({ data: 1, payload, meta: {} }))

      .dispatch(action)
      .silentRun()

    expect(queryService.apiRequest).toHaveBeenCalledWith(queries.denyFollowerUser, payload)
  })

  it('catch an error', async () => {
    const error = new Error('Fetch Error')

    queryService.apiRequest.mockRejectedValueOnce(error)

    await expectSaga(testAsRootSaga(users))
      .put(usersActions.usersDeclineFollowerUserFailure(error, payload))

      .dispatch(action)
      .silentRun()
  })
})
