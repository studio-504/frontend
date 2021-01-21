/* eslint jest/expect-expect: ["error", { "assertFunctionNames": ["expect", "setupSaga"] }] */
import { getContext } from 'redux-saga/effects'
import { expectSaga } from 'redux-saga-test-plan'
import * as actions from 'store/ducks/auth/actions'
import authFlow from 'store/ducks/auth/saga/authFlow'
import { testAsRootSaga, testNavigate } from 'tests/utils/helpers'

const navigation = { navigate: jest.fn(), reset: jest.fn() }

const setupSaga = () =>
  expectSaga(testAsRootSaga(authFlow)).provide([[getContext('ReactNavigationRef'), { current: navigation }]])

describe('Auth flow', () => {
  afterEach(() => {
    navigation.navigate.mockClear()
    navigation.reset.mockClear()
  })

  describe('request', () => {
    const allowAnonymous = true
    const tokenSuccess = { a: 1 }
    const dataSuccess = { b: 2 }
    const authProvider = 'GOOGLE'

    it('success', async () => {
      await setupSaga()
        .put(actions.authTokenRequest({ allowAnonymous }))
        .put(actions.authDataRequest({ allowAnonymous }))
        .put(
          actions.authFlowSuccess({
            message: { code: 'GENERIC', text: 'Auth flow completed', nativeError: '' },
            data: { authToken: tokenSuccess, authData: dataSuccess },
            meta: { authenticated: false, authProvider: 'GOOGLE' },
          }),
        )

        .dispatch(actions.authFlowRequest({ allowAnonymous, authProvider }))
        .dispatch(actions.authTokenSuccess(tokenSuccess))
        .dispatch(actions.authDataSuccess(dataSuccess))
        .silentRun()
    })

    describe('failure', () => {
      it('tokenFailure', async () => {
        const tokenFailure = { c: 1 }

        await setupSaga()
          .put(actions.authTokenRequest({ allowAnonymous }))
          .put(
            actions.authFlowFailure({
              message: {
                code: 'GENERIC',
                text: 'Failed to complete auth flow',
                nativeError: new Error('Failed to obtain token'),
              },
              meta: {
                authenticated: false,
              },
            }),
          )

          .dispatch(actions.authFlowRequest({ allowAnonymous, authProvider }))
          .dispatch(actions.authTokenFailure(tokenFailure))
          .silentRun()
      })

      it('dataFailure', async () => {
        const dataFailure = { g: 1 }

        await setupSaga()
          .put(actions.authTokenRequest({ allowAnonymous }))
          .put(actions.authDataRequest({ allowAnonymous }))
          .put(
            actions.authFlowFailure({
              message: {
                code: 'GENERIC',
                text: 'Failed to complete auth flow',
                nativeError: new Error('Failed to fetch data'),
              },
              meta: {
                authenticated: false,
              },
            }),
          )

          .dispatch(actions.authFlowRequest({ allowAnonymous, authProvider }))
          .dispatch(actions.authTokenSuccess(tokenSuccess))
          .dispatch(actions.authDataFailure(dataFailure))
          .silentRun()
      })
    })
  })

  describe('success handler', () => {
    it('authPrefetchRequest', async () => {
      await setupSaga()
        .put(actions.authPrefetchRequest())

        .dispatch(actions.authFlowSuccess())
        .silentRun()
    })

    describe('redirect to username screen', () => {
      it('google flow and empty username', async () => {
        await setupSaga()
          .dispatch(actions.authFlowSuccess({ meta: { authProvider: 'GOOGLE' } }))
          .silentRun()

        testNavigate(navigation, 'Auth.AuthUsername', { nextRoute: 'app' })
      })

      it('apple flow and empty username', async () => {
        await setupSaga()
          .dispatch(actions.authFlowSuccess({ meta: { authProvider: 'APPLE' } }))
          .silentRun()

        testNavigate(navigation, 'Auth.AuthUsername', { nextRoute: 'app' })
      })
    })

    describe('redirect to app home', () => {
      const user = { userId: '1', username: 'username' }
      const authorizedState = { auth: { user: user.userId }, entities: { users: { [user.userId]: user } } }

      it('google flow and has username', async () => {
        await setupSaga()
          .withState(authorizedState)
          .dispatch(actions.authFlowSuccess({ meta: { authProvider: 'GOOGLE' } }))
          .silentRun()

        expect(navigation.reset).toHaveBeenCalledWith({ index: 0, routes: [{ name: 'App' }] })
      })

      it('apple flow and has username', async () => {
        await setupSaga()
          .withState(authorizedState)
          .dispatch(actions.authFlowSuccess({ meta: { authProvider: 'APPLE' } }))
          .silentRun()

        expect(navigation.reset).toHaveBeenCalledWith({ index: 0, routes: [{ name: 'App' }] })
      })

      it('cognito flow', async () => {
        await setupSaga()
          .withState(authorizedState)
          .dispatch(actions.authFlowSuccess({ meta: { authProvider: 'COGNITO' } }))
          .silentRun()

        expect(navigation.reset).toHaveBeenCalledWith({ index: 0, routes: [{ name: 'App' }] })
      })
    })
  })

  describe('failure handler', () => {
    it('redirect to auth home', async () => {
      await setupSaga().dispatch(actions.authFlowFailure()).silentRun()

      testNavigate(navigation, 'Auth.AuthHome')
    })
  })
})
