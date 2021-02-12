import { expectSaga } from 'redux-saga-test-plan'
import * as postsActions from 'store/ducks/posts/actions'
import * as subscriptionsActions from 'store/ducks/subscriptions/actions'
import pollSubscription from 'store/ducks/subscriptions/saga/poll'

jest.useFakeTimers()

describe('pollSubscription', () => {
  it('update trending page every 30 minutes', async () => {
    const promise = expectSaga(pollSubscription)
      .put(postsActions.postsGetTrendingPostsRequest())

      .dispatch(subscriptionsActions.subscriptionsPollRequest())
      .silentRun()

    await Promise.resolve()
    await Promise.resolve()
    jest.runTimersToTime(30 * 60000)

    return promise
  })

  it('close channel on idle action', async () => {
    const promise = expectSaga(pollSubscription)
      .not.put(postsActions.postsGetTrendingPostsRequest())

      .dispatch(subscriptionsActions.subscriptionsPollRequest())
      .dispatch(subscriptionsActions.subscriptionsPollIdle())
      .silentRun()

    await Promise.resolve()
    await Promise.resolve()
    jest.runTimersToTime(30 * 60000)

    return promise
  })
})
