import { getContext } from 'redux-saga/effects'
import { expectSaga } from 'redux-saga-test-plan'
import { testAsRootSaga } from 'tests/utils/helpers'
import * as actions from 'store/ducks/auth/actions'
import authSigninCognito from 'store/ducks/auth/saga/authSigninCognito'

const username = 'username'
const password = 'password'
const AwsAuth = { signIn: jest.fn() }

AwsAuth.signIn.mockResolvedValue(true)

describe('authSigninCognito', () => {
  afterEach(() => {
    AwsAuth.signIn.mockClear()
  })

  it('success', async () => {
    await expectSaga(testAsRootSaga(authSigninCognito))
      .provide([[getContext('AwsAuth'), AwsAuth]])
      .put(actions.authFlowRequest({ allowAnonymous: false }))
      .put(actions.authSigninCognitoSuccess())

      .dispatch(actions.authSigninCognitoRequest({ username, password }))
      .dispatch(actions.authFlowSuccess())
      .silentRun()

    expect(AwsAuth.signIn).toHaveBeenCalledWith(username, password)
  })

  describe('failure', () => {
    it('AUTH_FLOW_FAILURE', async () => {
      await expectSaga(testAsRootSaga(authSigninCognito))
        .provide([[getContext('AwsAuth'), AwsAuth]])
        .put(actions.authSigninCognitoFailure(new Error('Failed to obtain flow'), { messageCode: 'GENERIC' }))

        .dispatch(actions.authSigninCognitoRequest({ username, password }))
        .dispatch(actions.authFlowFailure())
        .silentRun()
    })

    it('USER_NOT_CONFIRMED', async () => {
      const error = new Error('Error')
      error.code = 'UserNotConfirmedException'
      AwsAuth.signIn.mockRejectedValueOnce(error)

      await expectSaga(testAsRootSaga(authSigninCognito))
        .provide([[getContext('AwsAuth'), AwsAuth]])
        .put(actions.authSigninCognitoFailure(error, { messageCode: 'USER_NOT_CONFIRMED' }))

        .dispatch(actions.authSigninCognitoRequest({ username, password }))
        .dispatch(actions.authFlowSuccess())
        .silentRun()
    })

    it('USER_NOT_FOUND', async () => {
      const error = new Error('Error')
      error.code = 'UserNotFoundException'
      AwsAuth.signIn.mockRejectedValueOnce(error)

      await expectSaga(testAsRootSaga(authSigninCognito))
        .provide([[getContext('AwsAuth'), AwsAuth]])
        .put(actions.authSigninCognitoFailure(error, { messageCode: 'USER_NOT_FOUND' }))

        .dispatch(actions.authSigninCognitoRequest({ username, password }))
        .dispatch(actions.authFlowSuccess())
        .silentRun()
    })

    it('USER_NOT_AUTHORIZED', async () => {
      const error = new Error('Error')
      error.code = 'NotAuthorizedException'
      AwsAuth.signIn.mockRejectedValueOnce(error)

      await expectSaga(testAsRootSaga(authSigninCognito))
        .provide([[getContext('AwsAuth'), AwsAuth]])
        .put(actions.authSigninCognitoFailure(error, { messageCode: 'USER_NOT_AUTHORIZED' }))

        .dispatch(actions.authSigninCognitoRequest({ username, password }))
        .dispatch(actions.authFlowSuccess())
        .silentRun()
    })

    it('INVALID_PARAMETER', async () => {
      const error = new Error('Error')
      error.code = 'InvalidParameterException'
      AwsAuth.signIn.mockRejectedValueOnce(error)

      await expectSaga(testAsRootSaga(authSigninCognito))
        .provide([[getContext('AwsAuth'), AwsAuth]])
        .put(actions.authSigninCognitoFailure(error, { messageCode: 'INVALID_PARAMETER' }))

        .dispatch(actions.authSigninCognitoRequest({ username, password }))
        .dispatch(actions.authFlowSuccess())
        .silentRun()
    })
  })
})
