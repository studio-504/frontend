import { expectSaga } from 'redux-saga-test-plan'
import usersGetProfileSelfRequest from 'store/ducks/users/saga/usersGetProfileSelfRequest'
import * as usersActions from 'store/ducks/users/actions'
import * as queryService from 'services/Query'
import * as queries from 'store/ducks/users/queries'
import { entitiesMerge } from 'store/ducks/entities/saga'

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

    await expectSaga(usersGetProfileSelfRequest, action)
      .call(entitiesMerge, { entities, result: 1 })
      .put(usersActions.usersGetProfileSelfSuccess({ data: 1 }))
      .silentRun()

    expect(queryService.apiRequest).toHaveBeenCalledWith(queries.self)
  })

  it('catch an error', async () => {
    const error = new Error('Fetch Error')

    queryService.apiRequest.mockRejectedValueOnce(error)

    await expectSaga(usersGetProfileSelfRequest, action)
      .put(usersActions.usersGetProfileSelfFailure(error))

      .silentRun()
  })
})
