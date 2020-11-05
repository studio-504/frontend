import { expectSaga } from 'redux-saga-test-plan'
import * as actions from 'store/ducks/auth/actions'
import authFlow from 'store/ducks/auth/saga/authFlow'
import { testAsRootSaga } from 'tests/utils/helpers'

describe('Auth flow', () => {
  it('authPrefetchRequest on success', async () => {
    await expectSaga(testAsRootSaga(authFlow))
      .put(actions.authPrefetchRequest())

      .dispatch(actions.authFlowSuccess())
      .silentRun()
  })
})
 