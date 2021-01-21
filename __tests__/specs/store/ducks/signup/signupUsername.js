import { expectSaga } from 'redux-saga-test-plan'
import { getContext } from 'redux-saga/effects'
import { testAsRootSaga, testNavigate } from 'tests/utils/helpers'
import * as actions from 'store/ducks/signup/actions'
import signupUsername from 'store/ducks/signup/saga/signupUsername'
import * as queries from 'store/ducks/signup/queries'
import { logEvent } from 'services/Analytics'
import * as queryService from 'services/Query'

jest.mock('services/Query', () => ({ apiRequest: jest.fn().mockResolvedValue(true) }))

const navigation = { navigate: jest.fn(), reset: jest.fn() }

const setupSaga = () =>
  expectSaga(testAsRootSaga(signupUsername)).provide([[getContext('ReactNavigationRef'), { current: navigation }]])

describe('signupUsername saga', () => {
  afterEach(() => {
    navigation.navigate.mockClear()
    navigation.reset.mockClear()
    logEvent.mockClear()
    queryService.apiRequest.mockClear()
  })

  describe('request', () => {
    const username = 'username'
    const nextRoute = 'nextRoute'

    it('success', async () => {
      const data = { a: 1, b: 2 }
      queryService.apiRequest.mockResolvedValueOnce(data)

      await setupSaga()
        .put(
          actions.signupUsernameSuccess({
            message: { code: 'GENERIC', text: 'Username is available', nativeError: '' },
            payload: { username, nextRoute },
            meta: { nextRoute },
            data,
          }),
        )
        .dispatch(actions.signupUsernameRequest({ username, nextRoute }))
        .silentRun()

      expect(queryService.apiRequest).toHaveBeenCalledWith(queries.setUsername, { username })
      expect(logEvent).toHaveBeenCalledWith('SIGNUP_CHECK_REQUEST')
    })

    it('failure', async () => {
      const nativeError = new Error('Fetch error')
      queryService.apiRequest.mockRejectedValueOnce(nativeError)

      await setupSaga()
        .put(
          actions.signupUsernameFailure({
            message: { code: 'GENERIC', text: 'Failed to reserve username', nativeError },
            payload: { username: 'username', nextRoute: 'nextRoute' },
          }),
        )
        .dispatch(actions.signupUsernameRequest({ username, nextRoute }))
        .silentRun()

      expect(queryService.apiRequest).toHaveBeenCalledWith(queries.setUsername, { username })
      expect(logEvent).toHaveBeenCalledWith('SIGNUP_CHECK_REQUEST')
    })
  })

  describe('success handler', () => {
    it('redirect to app', async () => {
      await setupSaga()
        .dispatch(actions.signupUsernameSuccess({ meta: { nextRoute: 'app' } }))
        .silentRun()

      expect(navigation.reset).toHaveBeenCalledWith({ index: 0, routes: [{ name: 'App' }] })
      expect(logEvent).toHaveBeenCalledWith('SIGNUP_USERNAME_SUCCESS')
    })

    it('redirect to auth password screen', async () => {
      await setupSaga()
        .dispatch(actions.signupUsernameSuccess({ meta: {} }))
        .silentRun()

      testNavigate(navigation, 'Auth.AuthPassword')
      expect(logEvent).toHaveBeenCalledWith('SIGNUP_USERNAME_SUCCESS')
    })
  })
})
