import { expectSaga } from 'redux-saga-test-plan'
import { getContext } from 'redux-saga/effects'
import { testAsRootSaga, testNavigate } from 'tests/utils/helpers'
import * as actions from 'store/ducks/promocodes/actions'
import * as queries from 'store/ducks/promocodes/queries'
import * as usersActions from 'store/ducks/users/actions'
import promocodes from 'store/ducks/promocodes/saga'
import * as queryService from 'services/Query'

jest.mock('services/Query', () => ({ apiRequest: jest.fn().mockResolvedValue(true) }))

describe('Promocodes saga', () => {
  const code = '1234324'
  const navigation = { navigate: jest.fn() }

  afterEach(() => {
    navigation.navigate.mockClear()
    queryService.apiRequest.mockClear()
  })

  it('success', async () => {
    await expectSaga(testAsRootSaga(promocodes))
      .provide([[getContext('ReactNavigationRef'), { current: navigation }]])

      .call(queryService.apiRequest, queries.redeemPromotion, { code })
      .put(actions.promoCodesRedeemSuccess())
      .put(usersActions.usersGetProfileSelfRequest())

      .dispatch(actions.promoCodesRedeemRequest({ code }))
      .silentRun()

    testNavigate(navigation, 'InviteFriendsSuccess')
  })

  it('failure', async () => {
    const error = new Error('Error')
    queryService.apiRequest.mockRejectedValueOnce(error)

    await expectSaga(testAsRootSaga(promocodes))
      .provide([[getContext('ReactNavigationRef'), { current: navigation }]])

      .put(actions.promoCodesRedeemFailure(error))
      .not.put(actions.promoCodesRedeemSuccess())
      .not.put(usersActions.usersGetProfileSelfRequest())

      .dispatch(actions.promoCodesRedeemRequest({ code }))
      .silentRun()

    expect(navigation.navigate).not.toHaveBeenCalled()
  })
})
