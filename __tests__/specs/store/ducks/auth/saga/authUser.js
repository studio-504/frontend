import { expectSaga } from 'redux-saga-test-plan'
import authUser from 'store/ducks/auth/saga/authUser'
import * as authActions from 'store/ducks/auth/actions'
import * as queryService from 'services/Query'
import * as queries from 'store/ducks/users/queries'
import { testAsRootSaga } from 'tests/utils/helpers'
import * as normalizer from 'normalizer/schemas'
import { entitiesMerge } from 'store/ducks/entities/saga'

jest.mock('services/Query', () => ({ apiRequest: jest.fn().mockResolvedValue(true) }))

const action = authActions.authUserRequest()

describe('authUser', () => {
  afterEach(() => {
    queryService.apiRequest.mockClear()
  })

  it('success', async () => {
    const self = { userId: '1', b: 2 }
    const response = { data: { self } }

    queryService.apiRequest.mockResolvedValueOnce(response)

    await expectSaga(testAsRootSaga(authUser))
      .put(authActions.authUserSuccess({ data: '1' }))
      .call(entitiesMerge, normalizer.normalizeUserGet(self))

      .dispatch(action)
      .silentRun()

    expect(queryService.apiRequest).toHaveBeenCalledWith(queries.self)
  })

  it('catch an error', async () => {
    const error = new Error('Fetch Error')

    queryService.apiRequest.mockRejectedValueOnce(error)

    await expectSaga(testAsRootSaga(authUser))
      .put(authActions.authUserFailure(error))

      .dispatch(action)
      .silentRun()
  })
})
