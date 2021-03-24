import { expectSaga } from 'redux-saga-test-plan'
import users from 'store/ducks/users/saga'
import * as usersActions from 'store/ducks/users/actions'
import * as queryService from 'services/Query'
import * as queries from 'store/ducks/users/queries'
import { testEntitiesMerge, testAsRootSaga } from 'tests/utils/helpers'

jest.mock('services/Query', () => ({ apiRequest: jest.fn().mockResolvedValue(true) }))

const action = usersActions.usersGetProfileSelfRequest()

describe('usersGetProfileSelfRequest', () => {
  afterEach(() => {
    queryService.apiRequest.mockClear()
  })

  it('success', async () => {
    const self = { userId: 1, b: 2 }
    const response = { data: { self } }
    const entities = { users: { 1: self } }

    queryService.apiRequest.mockResolvedValueOnce(response)

    const saga = expectSaga(testAsRootSaga(users))

    await testEntitiesMerge(saga, entities)
      .put(usersActions.usersGetProfileSelfSuccess({ data: 1 }))

      .dispatch(action)
      .silentRun()

    expect(queryService.apiRequest).toHaveBeenCalledWith(queries.self)
  })

  it('catch an error', async () => {
    const error = new Error('Fetch Error')

    queryService.apiRequest.mockRejectedValueOnce(error)

    await expectSaga(testAsRootSaga(users))
      .put(usersActions.usersGetProfileSelfFailure(error))

      .dispatch(action)
      .silentRun()
  })
})
