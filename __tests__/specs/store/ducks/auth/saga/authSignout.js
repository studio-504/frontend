import { getContext } from 'redux-saga/effects'
import { expectSaga } from 'redux-saga-test-plan'
import authSignout from 'store/ducks/auth/saga/authSignout'
import * as subscriptionsActions from 'store/ducks/subscriptions/actions'
import * as actions from 'store/ducks/auth/actions'
import { testAsRootSaga } from 'tests/utils/helpers'
import { federatedGoogleSignout } from 'services/AWS'

/**
 * Mock Functions
 */
const AwsAuth = { signOut: jest.fn() }
const navigation = { navigate: jest.fn(), reset: jest.fn() }

jest.mock('services/AWS', () => ({ federatedGoogleSignout: jest.fn() }))

/**
 * Mock Context
 */
const context = [
  [getContext('AwsAuth'), AwsAuth],
  [getContext('ReactNavigationRef'), { current: navigation }],
]

describe('authSignout', () => {
  it('success', async () => {
    await expectSaga(testAsRootSaga(authSignout))
      .provide(context)

      .call([AwsAuth, 'signOut'])
      .call(federatedGoogleSignout)
      .put(subscriptionsActions.subscriptionsMainIdle())
      .put(subscriptionsActions.subscriptionsPollIdle())
      .put(actions.authSignoutSuccess())

      .dispatch(actions.authSignoutRequest())
      .silentRun()

    expect(navigation.reset).toHaveBeenCalledWith({ index: 0, routes: [{ name: 'Auth' }] })
  })

  it('failure', async () => {
    const error = new Error('Error')
    AwsAuth.signOut.mockRejectedValueOnce(error)

    await expectSaga(testAsRootSaga(authSignout))
      .provide(context)

      .put(actions.authSignoutFailure(error))

      .dispatch(actions.authSignoutRequest())
      .silentRun()

    expect(navigation.reset).toHaveBeenCalledWith({ index: 0, routes: [{ name: 'Auth' }] })
  })
})
