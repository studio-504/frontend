import { getContext } from 'redux-saga/effects'
import { expectSaga } from 'redux-saga-test-plan'
import * as actions from 'store/ducks/auth/actions'
import authFlow from 'store/ducks/auth/saga/authFlow'
import { testAsRootSaga, testNavigate } from 'tests/utils/helpers'
import { authorize } from 'store/ducks/auth/saga/helpers'

/**
 * Mock Function
 */
const AwsAuth = { currentCredentials: jest.fn().mockResolvedValue({ authenticated: true }) }
const navigation = { navigate: jest.fn(), reset: jest.fn() }

/**
 * Mock Context
 */
const context = [
  [getContext('AwsAuth'), AwsAuth],
  [getContext('ReactNavigationRef'), { current: navigation }],
]

const setupSaga = () => expectSaga(testAsRootSaga(authFlow)).provide(context)

describe('Auth flow', () => {
  afterEach(() => {
    navigation.navigate.mockClear()
    navigation.reset.mockClear()
  })

  it('authorized', async () => {
    await setupSaga()
      .call(authorize)
      .put(actions.authFlowSuccess())

      .dispatch(actions.authFlowRequest())
      .dispatch(actions.authGetUserSuccess())
      .silentRun()
  })

  it('guest', async () => {
    AwsAuth.currentCredentials.mockResolvedValueOnce({ authenticated: false })

    await setupSaga()
      .not.call(authorize)
      .put(actions.authFlowSuccess())

      .dispatch(actions.authFlowRequest())
      .dispatch(actions.authGetUserSuccess())
      .silentRun()

    testNavigate(navigation, 'Auth.AuthHome')
  })

  it('failure', async () => {
    const error = new Error('Error')
    AwsAuth.currentCredentials.mockRejectedValueOnce(error)

    await setupSaga()
      .put(actions.authFlowFailure(error))

      .dispatch(actions.authFlowRequest())
      .silentRun()
  })
})
