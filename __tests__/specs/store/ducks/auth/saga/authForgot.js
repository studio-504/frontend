import { getContext } from 'redux-saga/effects'
import { expectSaga } from 'redux-saga-test-plan'
import * as actions from 'store/ducks/auth/actions'
import authForgot from 'store/ducks/auth/saga/authForgot'
import { testAsRootSaga, testNavigate } from 'tests/utils/helpers'
import { logEvent } from 'services/Analytics'

const AwsAuth = { forgotPassword: jest.fn(), forgotPasswordSubmit: jest.fn() }
const navigation = { current: { navigate: jest.fn() } }
const phone = '12345678'
const countryCode = '+7'
const email = 'test@mail.com'

describe('authForgot', () => {
  afterEach(() => {
    AwsAuth.forgotPassword.mockClear()
    AwsAuth.forgotPasswordSubmit.mockClear()
    logEvent.mockClear()
  })

  describe('success', () => {
    it('phone', async () => {
      AwsAuth.forgotPassword.mockResolvedValueOnce(true)
      const username = `${countryCode}${phone}`

      await expectSaga(testAsRootSaga(authForgot))
        .provide([
          [getContext('AwsAuth'), AwsAuth],
          [getContext('ReactNavigationRef'), navigation],
        ])

        .put(actions.authForgotSuccess())

        .dispatch(actions.authForgotRequest({ username, phone, countryCode }))
        .silentRun()

      expect(AwsAuth.forgotPassword).toHaveBeenCalledWith(username)
      testNavigate(navigation.current, 'Auth.AuthForgotConfirm')
      expect(logEvent).toHaveBeenCalledWith('authForgotSuccess')
    })

    it('email', async () => {
      AwsAuth.forgotPassword.mockResolvedValueOnce(true)

      await expectSaga(testAsRootSaga(authForgot))
        .provide([
          [getContext('AwsAuth'), AwsAuth],
          [getContext('ReactNavigationRef'), navigation],
        ])

        .put(actions.authForgotSuccess())

        .dispatch(actions.authForgotRequest({ username: email, email }))
        .silentRun()

      expect(AwsAuth.forgotPassword).toHaveBeenCalledWith(email)
      testNavigate(navigation.current, 'Auth.AuthForgotConfirm')
      expect(logEvent).toHaveBeenCalledWith('authForgotSuccess')
    })
  })

  describe('failure', () => {
    it('UserNotFoundException', async () => {
      AwsAuth.forgotPassword.mockRejectedValueOnce({ code: 'UserNotFoundException' })
      const message = {
        code: 'USER_NOT_FOUND',
        text: 'User does not exist',
        nativeError: { code: 'UserNotFoundException' },
      }

      await expectSaga(testAsRootSaga(authForgot))
        .provide([
          [getContext('AwsAuth'), AwsAuth],
          [getContext('ReactNavigationRef'), navigation],
        ])

        .put(actions.authForgotFailure({ message }))

        .dispatch(actions.authForgotRequest({ username: email, email }))
        .silentRun()
    })

    it('Generic', async () => {
      const nativeError = new Error('Error')
      AwsAuth.forgotPassword.mockRejectedValueOnce(nativeError)
      const message = { code: 'GENERIC', text: 'Failed to reset the password', nativeError }

      await expectSaga(testAsRootSaga(authForgot))
        .provide([
          [getContext('AwsAuth'), AwsAuth],
          [getContext('ReactNavigationRef'), navigation],
        ])

        .put(actions.authForgotFailure({ message }))

        .dispatch(actions.authForgotRequest({ username: email, email }))
        .silentRun()
    })
  })

  describe('authForgotConfirmRequest', () => {
    const payload = {
      username: 'username',
      confirmationCode: 'confirmationCode',
      password: 'password',
    }

    it('success', async () => {
      await expectSaga(testAsRootSaga(authForgot))
        .provide([
          [getContext('AwsAuth'), AwsAuth],
          [getContext('ReactNavigationRef'), navigation],
        ])

        .put(
          actions.authForgotConfirmSuccess({
            message: { code: 'GENERIC', text: 'Successfully confirmed new password', nativeError: '' },
            data: undefined,
          }),
        )

        .dispatch(actions.authForgotConfirmRequest(payload))
        .silentRun()

      expect(AwsAuth.forgotPasswordSubmit).toHaveBeenCalledWith(
        payload.username,
        payload.confirmationCode,
        payload.password,
      )

      testNavigate(navigation.current, 'Auth.Signin.AuthSigninEmail')
      expect(logEvent).toHaveBeenCalledWith('AUTH_FORGOT_CONFIRM_SUCCESS')
    })

    describe('failure', () => {
      it('InvalidPasswordException', async () => {
        AwsAuth.forgotPasswordSubmit.mockRejectedValueOnce({ code: 'InvalidPasswordException' })
        const message = {
          code: 'INVALID_PASSWORD',
          text: 'Password did not conform with policy: Password must have uppercase-alpha-numeric-special characters',
          nativeError: { code: 'InvalidPasswordException' },
        }

        await expectSaga(testAsRootSaga(authForgot))
          .provide([
            [getContext('AwsAuth'), AwsAuth],
            [getContext('ReactNavigationRef'), navigation],
          ])

          .put(actions.authForgotConfirmFailure({ message }))

          .dispatch(actions.authForgotConfirmRequest(payload))
          .silentRun()
      })

      it('CodeMismatchException', async () => {
        AwsAuth.forgotPasswordSubmit.mockRejectedValueOnce({ code: 'CodeMismatchException' })
        const message = {
          code: 'CODE_MISMATCH',
          text: 'Invalid verification code provided',
          nativeError: { code: 'CodeMismatchException' },
        }

        await expectSaga(testAsRootSaga(authForgot))
          .provide([
            [getContext('AwsAuth'), AwsAuth],
            [getContext('ReactNavigationRef'), navigation],
          ])

          .put(actions.authForgotConfirmFailure({ message }))

          .dispatch(actions.authForgotConfirmRequest(payload))
          .silentRun()
      })

      it('Generic', async () => {
        const nativeError = new Error('Error')
        AwsAuth.forgotPasswordSubmit.mockRejectedValueOnce(nativeError)
        const message = {
          code: 'GENERIC',
          text: 'Failed to confirm new password',
          nativeError,
        }

        await expectSaga(testAsRootSaga(authForgot))
          .provide([
            [getContext('AwsAuth'), AwsAuth],
            [getContext('ReactNavigationRef'), navigation],
          ])

          .put(actions.authForgotConfirmFailure({ message }))

          .dispatch(actions.authForgotConfirmRequest(payload))
          .silentRun()
      })
    })
  })
})
