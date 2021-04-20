import { expectSaga } from 'redux-saga-test-plan'
import { testAsRootSaga } from 'tests/utils/helpers'
import * as queryService from 'services/Query'
import * as actions from 'store/ducks/push/actions'
import * as queries from 'store/ducks/push/queries'
import push from 'store/ducks/push/saga'

/**
 * Mock Functions
 */
jest.mock('services/Query', () => ({ apiRequest: jest.fn().mockResolvedValue(true) }))

describe('Push', () => {
  describe('pushSetApnsTokenRequest', () => {
    const token = 'token'

    it('success', async () => {
      await expectSaga(testAsRootSaga(push))
        .call([queryService, 'apiRequest'], queries.setUserAPNSToken, { token })
        .put(actions.pushSetApnsTokenSuccess())

        .dispatch(actions.pushSetApnsTokenRequest({ token }))
        .silentRun()
    })

    it('failure', async () => {
      const error = new Error('Error')
      queryService.apiRequest.mockRejectedValueOnce(error)

      await expectSaga(testAsRootSaga(push))
        .call([queryService, 'apiRequest'], queries.setUserAPNSToken, { token })
        .put(actions.pushSetApnsTokenFailure(error))

        .dispatch(actions.pushSetApnsTokenRequest({ token }))
        .silentRun()
    })
  })
})
