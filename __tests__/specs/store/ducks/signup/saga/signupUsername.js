import { expectSaga } from 'redux-saga-test-plan'
import { getContext } from 'redux-saga/effects'
import { testAsRootSaga, testNavigate } from 'tests/utils/helpers'
import * as actions from 'store/ducks/signup/actions'
import * as authActions from 'store/ducks/auth/actions'
import signupUsername from 'store/ducks/signup/saga/signupUsername'
import * as queries from 'store/ducks/signup/queries'
import * as queryService from 'services/Query'

jest.mock('services/Query', () => ({ apiRequest: jest.fn().mockResolvedValue(true) }))

const navigation = { navigate: jest.fn(), reset: jest.fn() }

const setupSaga = () =>
  expectSaga(testAsRootSaga(signupUsername)).provide([[getContext('ReactNavigationRef'), { current: navigation }]])

describe('signupUsername saga', () => {
  const username = 'username'

  afterEach(() => {
    navigation.navigate.mockClear()
    navigation.reset.mockClear()
    queryService.apiRequest.mockClear()
  })

  describe('success', () => {
    it('navigate to password by default', async () => {
      const data = { a: 1, b: 2 }
      queryService.apiRequest.mockResolvedValueOnce(data)

      await setupSaga()
        .put(actions.signupUsernameSuccess())
        .dispatch(actions.signupUsernameRequest({ username }))

        .silentRun()

      expect(queryService.apiRequest).toHaveBeenCalledWith(queries.setUsername, { username })
      testNavigate(navigation, 'Auth.AuthPassword')
    })

    it('navigate to app', async () => {
      const data = { a: 1, b: 2 }
      queryService.apiRequest.mockResolvedValueOnce(data)

      await setupSaga()
        .put(actions.signupUsernameSuccess())
        .dispatch(actions.signupUsernameRequest({ username, nextRoute: 'app' }))
        .dispatch(authActions.authGetUserSuccess())
        .silentRun()

      expect(queryService.apiRequest).toHaveBeenCalledWith(queries.setUsername, { username })
      expect(navigation.reset).toHaveBeenCalledWith({ index: 0, routes: [{ name: 'App' }] })
    })
  })

  describe('failure', () => {
    it('handle request error', async () => {
      const nativeError = new Error('Fetch error')
      queryService.apiRequest.mockRejectedValueOnce(nativeError)

      await setupSaga()
        .put(actions.signupUsernameFailure(nativeError))
        .dispatch(actions.signupUsernameRequest({ username }))
        .silentRun()

      expect(queryService.apiRequest).toHaveBeenCalledWith(queries.setUsername, { username })
    })
  })
})
