import { expectSaga } from 'redux-saga-test-plan'
import { getContext } from 'redux-saga/effects'
import authSigninApple from 'store/ducks/auth/saga/authSigninApple'
import { testAsRootSaga } from 'tests/utils/helpers'
import { federatedAppleSignin, validateUserExistance } from 'services/AWS'
import * as actions from 'store/ducks/auth/actions'
import * as queryService from 'services/Query'
import * as queries from 'store/ducks/auth/queries'

jest.mock('services/Query', () => ({ apiRequest: jest.fn() }))

jest.mock('services/AWS', () => ({
  federatedAppleSignin: jest.fn(),
  validateUserExistance: jest.fn(),
}))

const applePayload = {
  token: 'token',
  expires_at: 'expires_at',
  user: { id: 'id', fullName: 'fullName', email: 'email' },
}

const userPayload = {
  id: 'id',
  fullName: 'fullName',
  email: 'email',
  authProvider: 'APPLE',
  token: 'token',
  expires_at: 'expires_at',
}

const successPayload = {
  message: {
    code: 'GENERIC',
    text: 'Successfully signed with Apple',
    nativeError: '',
  },
}

const AwsAuth = { federatedSignIn: jest.fn() }
federatedAppleSignin.mockResolvedValue(applePayload)
AwsAuth.federatedSignIn.mockResolvedValue(true)

const mockApiRequest = (options) => {
  queryService.apiRequest.mockImplementation((query) => {
    if (query === queries.setFullname) {
      return options.setFullname
    } else if (query === queries.createAnonymousUser) {
      return options.createAnonymousUser
    } else if (query === queries.linkAppleLogin) {
      return options.linkAppleLogin
    } else {
      return Promise.resolve(true)
    }
  })
}

const setupSaga = () => expectSaga(testAsRootSaga(authSigninApple)).provide([[getContext('AwsAuth'), AwsAuth]])

describe('authSigninApple', () => {
  afterEach(() => {
    validateUserExistance.mockClear()
    queryService.apiRequest.mockReset()
    AwsAuth.federatedSignIn.mockClear()
  })

  describe('sign up', () => {
    const userExists = false

    beforeAll(() => {
      validateUserExistance.mockReset().mockResolvedValue(userExists)
    })

    describe('success', () => {
      it('normal flow', async () => {
        queryService.apiRequest.mockResolvedValue(true)

        await setupSaga()
          .call(federatedAppleSignin)
          .call([queryService, 'apiRequest'], queries.createAnonymousUser)
          .put(actions.authFlowRequest({ allowAnonymous: userExists, authProvider: 'APPLE', userExists }))
          .put(actions.authSigninAppleSuccess(successPayload))

          .dispatch(actions.authSigninAppleRequest())
          .dispatch(actions.authFlowSuccess())
          .silentRun()

        expect(AwsAuth.federatedSignIn).toHaveBeenCalledWith(
          'appleid.apple.com',
          { expires_at: 'expires_at', token: 'token' },
          userPayload,
        )
      })

      it('empty fullName', async () => {
        mockApiRequest({
          setFullname: Promise.reject(new Error('FullName cannot be empty')),
          createAnonymousUser: Promise.resolve(true),
          linkAppleLogin: Promise.resolve(true),
        })

        await setupSaga()
          .put(actions.authSigninAppleSuccess(successPayload))

          .dispatch(actions.authSigninAppleRequest())
          .dispatch(actions.authFlowSuccess())
          .silentRun()
      })
    })

    describe('failure', () => {
      it('linkAppleLogin fail', async () => {
        const nativeError = new Error('linkAppleLogin fail')

        mockApiRequest({
          setFullname: Promise.resolve(true),
          createAnonymousUser: Promise.resolve(true),
          linkAppleLogin: Promise.reject(nativeError),
        })

        await setupSaga()
          .put(actions.authSigninAppleFailure(nativeError))

          .dispatch(actions.authSigninAppleRequest())
          .silentRun()
      })

      it('federatedAppleSignin fail', async () => {
        const nativeError = new Error('federatedAppleSignin fail')

        federatedAppleSignin.mockRejectedValueOnce(nativeError)
        queryService.apiRequest.mockResolvedValue(true)

        await setupSaga()
          .put(actions.authSigninAppleFailure(nativeError))

          .dispatch(actions.authSigninAppleRequest())
          .silentRun()
      })

      it('AUTH_FLOW_FAILURE', async () => {
        await setupSaga()
          .put(actions.authSigninAppleFailure(new Error('Failed to obtain flow')))

          .dispatch(actions.authSigninAppleRequest())
          .dispatch(actions.authFlowFailure())
          .silentRun()
      })
    })
  })

  describe('sign in', () => {
    const userExists = true

    beforeAll(() => {
      validateUserExistance.mockReset().mockResolvedValue(userExists)
    })

    it('success', async () => {
      await expectSaga(testAsRootSaga(authSigninApple))
        .provide([[getContext('AwsAuth'), AwsAuth]])

        .call(federatedAppleSignin)
        .call(validateUserExistance, userPayload)
        .not.call([queryService, 'apiRequest'], queries.createAnonymousUser)
        .put(actions.authFlowRequest({ allowAnonymous: userExists, authProvider: 'APPLE', userExists }))
        .put(actions.authSigninAppleSuccess(successPayload))

        .dispatch(actions.authSigninAppleRequest())
        .dispatch(actions.authFlowSuccess())
        .silentRun()

      expect(AwsAuth.federatedSignIn).toHaveBeenCalledWith(
        'appleid.apple.com',
        { expires_at: 'expires_at', token: 'token' },
        userPayload,
      )
    })

    describe('failure', () => {
      it('federatedSignIn failed', async () => {
        const nativeError = new Error('federatedSignIn failed')
        AwsAuth.federatedSignIn.mockRejectedValueOnce(nativeError)

        await expectSaga(testAsRootSaga(authSigninApple))
          .provide([[getContext('AwsAuth'), AwsAuth]])

          .put(actions.authSigninAppleFailure(nativeError))

          .dispatch(actions.authSigninAppleRequest())
          .silentRun()
      })

      it('AUTH_FLOW_FAILURE', async () => {
        await setupSaga()
          .put(actions.authSigninAppleFailure(new Error('Failed to obtain flow')))

          .dispatch(actions.authSigninAppleRequest())
          .dispatch(actions.authFlowFailure())
          .silentRun()
      })
    })
  })
})
