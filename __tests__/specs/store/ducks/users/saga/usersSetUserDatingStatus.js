/* eslint jest/expect-expect: ["error", { "assertFunctionNames": ["expect", "testGqlError", "expectSaga"] }] */
import { expectSaga } from 'redux-saga-test-plan'
import usersSetUserDatingStatusRequest from 'store/ducks/users/saga/usersSetUserDatingStatus'
import * as usersActions from 'store/ducks/users/actions'
import * as queryService from 'services/Query'
import * as queries from 'store/ducks/users/queries'
import { testEntitiesMerge } from 'tests/utils/helpers'

jest.mock('services/Query', () => ({ apiRequest: jest.fn().mockResolvedValue(true) }))

const payload = { userId: 1 }
const action = usersActions.usersSetUserDatingStatusRequest(payload)

describe('usersSetUserDatingStatusRequest', () => {
  afterEach(() => {
    queryService.apiRequest.mockClear()
  })

  it('success', async () => {
    const user = { userId: 1 }
    const response = { data: { setUserDatingStatus: user } }
    const entities = { users: { 1: user } }

    queryService.apiRequest.mockResolvedValueOnce(response)

    const saga = expectSaga(usersSetUserDatingStatusRequest, action)

    await testEntitiesMerge(saga, entities)
      .put(usersActions.usersSetUserDatingStatusSuccess({ data: 1, payload }))

      .silentRun()

    expect(queryService.apiRequest).toHaveBeenCalledWith(queries.setUserDatingStatus, payload)
  })

  it('failure', async () => {
    const error = new Error('Error')
    queryService.apiRequest.mockRejectedValueOnce(error)

    await expectSaga(usersSetUserDatingStatusRequest, action)
      .put(usersActions.usersSetUserDatingStatusFailure(error))
      .run()
  })
})
