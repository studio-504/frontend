import { expectSaga } from 'redux-saga-test-plan'
import { getContext } from 'redux-saga/effects'
import * as actions from 'store/ducks/signup/actions'
import { testAsRootSaga, testNavigate } from 'tests/utils/helpers'
import signupConfirm from 'store/ducks/signup/saga/signupConfirm'
import { logEvent } from 'services/Analytics'
import * as queryService from 'services/Query'
import * as queries from 'store/ducks/signup/queries'

jest.mock('services/Query', () => ({ apiRequest: jest.fn().mockResolvedValue(true) }))
const navigation = { navigate: jest.fn() }
const confirmationCode = '123456'

describe('signupConfirm', () => {
  afterEach(() => {
    navigation.navigate.mockClear()
    queryService.apiRequest.mockClear()
    logEvent.mockClear()
  })

  describe('success', () => {
    it('email', async () => {
      const usernameType = 'email'
      const message = { code: 'GENERIC', text: 'Successfully confirmed account, you can signin now', nativeError: '' }
      const payload = { usernameType, confirmationCode }

      await expectSaga(testAsRootSaga(signupConfirm))
        .provide([[getContext('ReactNavigationRef'), { current: navigation }]])

        .put(actions.signupConfirmSuccess({ message, data: undefined, payload }))

        .dispatch(actions.signupConfirmRequest({ usernameType, confirmationCode }))
        .silentRun()

      expect(queryService.apiRequest).toHaveBeenCalledWith(queries.finishChangeUserEmail, {
        verificationCode: confirmationCode,
      })

      expect(logEvent).toHaveBeenCalledWith('SIGNUP_CONFIRM_REQUEST')
      expect(logEvent).toHaveBeenCalledWith('SIGNUP_CONFIRM_SUCCESS')

      testNavigate(navigation, 'Auth.AuthUsername')
    })

    it('phone', async () => {
      const usernameType = 'phone'
      const message = { code: 'GENERIC', text: 'Successfully confirmed account, you can signin now', nativeError: '' }
      const payload = { usernameType, confirmationCode }

      await expectSaga(testAsRootSaga(signupConfirm))
        .provide([[getContext('ReactNavigationRef'), { current: navigation }]])

        .put(actions.signupConfirmSuccess({ message, data: undefined, payload }))

        .dispatch(actions.signupConfirmRequest({ usernameType, confirmationCode }))
        .silentRun()

      expect(queryService.apiRequest).toHaveBeenCalledWith(queries.finishChangeUserPhoneNumber, {
        verificationCode: confirmationCode,
      })

      expect(logEvent).toHaveBeenCalledWith('SIGNUP_CONFIRM_REQUEST')
      expect(logEvent).toHaveBeenCalledWith('SIGNUP_CONFIRM_SUCCESS')

      testNavigate(navigation, 'Auth.AuthUsername')
    })
  })

  describe('failure', () => {
    it('Unsupported usernameType', async () => {
      const nativeError = new Error('Unsupported usernameType')
      const payload = { usernameType: undefined, confirmationCode }

      await expectSaga(testAsRootSaga(signupConfirm))
        .put(actions.signupConfirmFailure(nativeError, { errorCode: 'GENERIC' }))

        .dispatch(actions.signupConfirmRequest(payload))
        .silentRun()
    })

    it('AliasExistsException', async () => {
      const nativeError = new Error('AliasExistsException')
      nativeError.code = 'AliasExistsException'
      const payload = { usernameType: 'email', confirmationCode }

      queryService.apiRequest.mockRejectedValueOnce(nativeError)

      await expectSaga(testAsRootSaga(signupConfirm))
        .put(actions.signupConfirmFailure(nativeError, { errorCode: 'ALIAS_EXISTS' }))

        .dispatch(actions.signupConfirmRequest(payload))
        .silentRun()
    })

    it('ExpiredCodeException', async () => {
      const nativeError = new Error('ExpiredCodeException')
      nativeError.code = 'ExpiredCodeException'
      const payload = { usernameType: 'email', confirmationCode }

      queryService.apiRequest.mockRejectedValueOnce(nativeError)

      await expectSaga(testAsRootSaga(signupConfirm))
        .put(actions.signupConfirmFailure(nativeError, { errorCode: 'CODE_EXPIRED' }))

        .dispatch(actions.signupConfirmRequest(payload))
        .silentRun()
    })

    it('CodeMismatchException', async () => {
      const nativeError = new Error('CodeMismatchException')
      nativeError.code = 'CodeMismatchException'
      const payload = { usernameType: 'email', confirmationCode }

      queryService.apiRequest.mockRejectedValueOnce(nativeError)

      await expectSaga(testAsRootSaga(signupConfirm))
        .put(actions.signupConfirmFailure(nativeError, { errorCode: 'CODE_MISMATCH' }))

        .dispatch(actions.signupConfirmRequest(payload))
        .silentRun()
    })
  })
})
