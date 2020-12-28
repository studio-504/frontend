import { expectSaga } from 'redux-saga-test-plan'
import { testAsRootSaga } from 'tests/utils/helpers'
import { showMessage } from 'react-native-flash-message'
import snackbars from 'store/ducks/snackbars/saga'
import * as Logger from 'services/Logger'

const defaultMessage = { message: 'Oops! Something went wrong', type: 'danger', icon: 'warning' }
jest.mock('react-native-flash-message', () => ({ showMessage: jest.fn() }))

describe('Snackbars saga', () => {
  afterEach(() => {
    showMessage.mockClear()
    Logger.captureException.mockClear()
  })

  it('default error message', async () => {
    await expectSaga(testAsRootSaga(snackbars))
      .call(showMessage, defaultMessage)
      .dispatch({ type: 'ACTION_FAILURE' })
      .silentRun()
  })

  it('capture exception', async () => {
    const error = new Error('Error')
    showMessage.mockRejectedValueOnce(error)

    await expectSaga(testAsRootSaga(snackbars)).dispatch({ type: 'ACTION_FAILURE' }).silentRun()

    expect(Logger.captureException).toHaveBeenCalledWith(error)
  })

  it('user friendly error message', async () => {
    const message = 'ErrorMessage'

    await expectSaga(testAsRootSaga(snackbars))
      .call(showMessage, { message, type: 'danger', icon: 'warning' })
      .dispatch({ type: 'ACTION_FAILURE', payload: { message: { text: message } } })
      .silentRun()
  })

  describe('blacklist', () => {
    it('AUTH_DATA_FAILURE', async () => {
      await expectSaga(testAsRootSaga(snackbars))
        .not.call(showMessage, defaultMessage)
        .dispatch({ type: 'AUTH_DATA_FAILURE' })
        .silentRun()
    })

    it('AUTH_FLOW_FAILURE', async () => {
      await expectSaga(testAsRootSaga(snackbars))
        .not.call(showMessage, defaultMessage)
        .dispatch({ type: 'AUTH_FLOW_FAILURE' })
        .silentRun()
    })
  })
})
