import { getContext } from 'redux-saga/effects'
import { expectSaga } from 'redux-saga-test-plan'
import * as actions from 'store/ducks/auth/actions'
import authForgot from 'store/ducks/auth/saga/authForgot'
import { testAsRootSaga, testNavigate } from 'tests/utils/helpers'
import { logEvent } from 'services/Analytics'

const AwsAuth = { forgotPassword: jest.fn() }
const navigation = { current: { navigate: jest.fn() } }
const username = 'username'

describe('authForgot', () => {
  it('success', async () => {
    AwsAuth.forgotPassword.mockResolvedValueOnce(true)

    await expectSaga(testAsRootSaga(authForgot))
      .provide([
        [getContext('AwsAuth'), AwsAuth],
        [getContext('ReactNavigationRef'), navigation],
      ])

      .put(actions.authForgotSuccess())

      .dispatch(actions.authForgotRequest({ username }))
      .silentRun()

    testNavigate(navigation.current, 'Auth.AuthForgotConfirm')
    expect(logEvent).toHaveBeenCalledWith('authForgotSuccess')
  })

  describe('failure', () => {
    it('UserNotFoundException', async () => {
      AwsAuth.forgotPassword.mockRejectedValueOnce({ code: 'UserNotFoundException' })
      const message = { code: 'USER_NOT_FOUND', text: 'User does not exist', nativeError: '' }

      await expectSaga(testAsRootSaga(authForgot))
        .provide([
          [getContext('AwsAuth'), AwsAuth],
          [getContext('ReactNavigationRef'), navigation],
        ])

        .put(actions.authForgotFailure({ message }))

        .dispatch(actions.authForgotRequest({ username }))
        .silentRun()
    })

    it('Generic', async () => {
      AwsAuth.forgotPassword.mockRejectedValueOnce(new Error('Error'))
      const message = { code: 'GENERIC', text: 'Failed to reset the password', nativeError: 'Error' }

      await expectSaga(testAsRootSaga(authForgot))
        .provide([
          [getContext('AwsAuth'), AwsAuth],
          [getContext('ReactNavigationRef'), navigation],
        ])

        .put(actions.authForgotFailure({ message }))

        .dispatch(actions.authForgotRequest({ username }))
        .silentRun()
    })
  })
})
