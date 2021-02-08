/* eslint jest/expect-expect: ["error", { "assertFunctionNames": ["expect", "testBlackListAction", "expectSaga"] }] */
import { expectSaga } from 'redux-saga-test-plan'
import { testAsRootSaga } from 'tests/utils/helpers'
import { showMessage } from 'react-native-flash-message'
import snackbars from 'store/ducks/snackbars/saga'
import { MESSAGES } from 'services/Errors'
import * as Logger from 'services/Logger'

const defaultMessage = { message: 'Oops! Something went wrong', type: 'danger', icon: 'warning' }
jest.mock('react-native-flash-message', () => ({ showMessage: jest.fn() }))

describe('Snackbars saga', () => {
  afterEach(() => {
    showMessage.mockClear()
    Logger.captureException.mockClear()
  })

  describe('success', () => {
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
  })

  describe('prevent show a message', () => {
    it('anonymous user', async () => {
      const message = 'User is not ACTIVE'

      await expectSaga(testAsRootSaga(snackbars))
        .not.call(showMessage, { message, type: 'danger', icon: 'warning' })
        .dispatch({ type: 'ACTION_FAILURE', payload: { message: { text: message } } })
        .silentRun()
    })

    it('native error', async () => {
      const message = 'message'

      await expectSaga(testAsRootSaga(snackbars))
        .not.call(showMessage, { message, type: 'danger', icon: 'warning' })
        .dispatch({ type: 'ACTION_FAILURE', payload: { message } })
        .silentRun()
    })

    it('cancel request error', async () => {
      const message = MESSAGES.CANCEL_REQUEST_ON_SIGNOUT

      await expectSaga(testAsRootSaga(snackbars))
        .not.call(showMessage, { message, type: 'danger', icon: 'warning' })
        .dispatch({ type: 'ACTION_FAILURE', payload: { message: { text: message } } })
        .silentRun()
    })

    it('blacklist', () => {
      const testBlackListAction = (type) => async () => {
        await expectSaga(testAsRootSaga(snackbars)).not.call(showMessage, defaultMessage).dispatch({ type }).silentRun()
      }

      testBlackListAction('AUTH_DATA_FAILURE')
      testBlackListAction('AUTH_FLOW_FAILURE')
      testBlackListAction('AUTH_TOKEN_FAILURE')
      testBlackListAction('AUTH_RESET_FAILURE')
      testBlackListAction('AUTH_PREFETCH_FAILURE')
      testBlackListAction('AUTH_CHECK_FAILURE')
      testBlackListAction('CACHE_FETCH_FAILURE')
      testBlackListAction('POSTS_REPORT_POST_VIEWS_FAILURE')
      testBlackListAction('USERS_SET_APNS_TOKEN_FAILURE')
      testBlackListAction('USERS_REPORT_SCREEN_VIEWS_FAILURE')
    })
  })
})
