/* eslint jest/expect-expect: ["error", { "assertFunctionNames": ["expect", "testBlackListAction", "expectSaga", "testShowMessage"] }] */
import { Alert } from 'react-native'
import { expectSaga } from 'redux-saga-test-plan'
import { testAsRootSaga } from 'tests/utils/helpers'
import { showMessage } from 'react-native-flash-message'
import Config from 'react-native-config'
import snackbars from 'store/ducks/snackbars/saga'
import { MESSAGES } from 'services/Errors'
import * as Logger from 'services/Logger'

jest.spyOn(Alert, 'alert')
jest.mock('react-native-flash-message', () => ({ showMessage: jest.fn() }))
jest.mock('react-native-config', () => ({ ENVIRONMENT: 'production' }))

describe('Snackbars saga', () => {
  afterEach(() => {
    Alert.alert.mockClear()
    showMessage.mockClear()
    Logger.captureException.mockClear()
  })

  function testShowMessage({ message, type, icon }) {
    expect(showMessage).toHaveBeenCalled()
    const options = showMessage.mock.calls[0][0]

    expect(options.message).toBe(message)
    expect(options.type).toBe(type)
    expect(options.icon).toBe(icon)
  }

  describe('success', () => {
    it('default error message', async () => {
      await expectSaga(testAsRootSaga(snackbars)).dispatch({ type: 'ACTION_FAILURE' }).silentRun()

      testShowMessage({ message: 'Oops! Something went wrong', type: 'danger', icon: 'warning' })
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
        .dispatch({ type: 'ACTION_FAILURE', payload: { message: { text: message } } })
        .silentRun()

      testShowMessage({ message, type: 'danger', icon: 'warning' })
    })
  })

  describe('debug mode', () => {
    const action = { type: 'ACTION_FAILURE' }
    const simulatePress = () => showMessage.mock.calls[0][0].onPress()

    it('dev env', async () => {
      Config.ENVIRONMENT = 'development'
      await expectSaga(testAsRootSaga(snackbars)).dispatch({ type: 'ACTION_FAILURE' }).silentRun()

      simulatePress()
      expect(Config.ENVIRONMENT).toBe('development')
      expect(Alert.alert).toHaveBeenCalledWith(JSON.stringify(action))
      Config.ENVIRONMENT = 'production'
    })

    it('prod env', async () => {
      expect(Config.ENVIRONMENT).toBe('production')
      await expectSaga(testAsRootSaga(snackbars)).dispatch({ type: 'ACTION_FAILURE' }).silentRun()

      simulatePress()
      expect(Alert.alert).not.toHaveBeenCalled()
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

      await expectSaga(testAsRootSaga(snackbars)).dispatch({ type: 'ACTION_FAILURE', payload: { message } }).silentRun()

      expect(showMessage).not.toHaveBeenCalled()
    })

    it('cancel request error', async () => {
      const message = MESSAGES.CANCEL_REQUEST_ON_SIGNOUT

      await expectSaga(testAsRootSaga(snackbars))
        .dispatch({ type: 'ACTION_FAILURE', payload: { message: { text: message } } })
        .silentRun()

      expect(showMessage).not.toHaveBeenCalled()
    })

    it('blacklist', () => {
      const testBlackListAction = (type) => async () => {
        await expectSaga(testAsRootSaga(snackbars)).dispatch({ type }).silentRun()
        expect(showMessage).not.toHaveBeenCalled()
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
