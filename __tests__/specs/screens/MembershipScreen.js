import React from 'react'
import {Linking} from 'react-native'
import { useDispatch } from 'react-redux'
import { renderWithProviders, fireEvent } from 'tests/utils'
import * as purchasesActions from 'store/ducks/purchases/actions'
import * as authSelector from 'store/ducks/auth/selectors'
import * as purchasesSelectors from 'store/ducks/purchases/selectors'
import MembershipScreen from 'screens/MembershipScreen'

jest.mock('react-redux', () => ({ useDispatch: jest.fn(), useSelector: (fn) => fn() }))
jest.mock('store/ducks/auth/selectors', () => ({ authUserSelector: jest.fn() }))
jest.mock('store/ducks/purchases/selectors', () => ({ purchasesRequest: jest.fn() }))

const basicUser = { subscriptionLevel: 'BASIC' }
const premiumUser = { subscriptionLevel: 'DIAMOND' }

authSelector.authUserSelector.mockReturnValue(basicUser)
purchasesSelectors.purchasesRequest.mockReturnValue({ status: 'idle' })

const dispatch = jest.fn()
useDispatch.mockReturnValue(dispatch)

const setup = () => renderWithProviders(<MembershipScreen />)

describe('Membership Screen', () => {
  it('user with basic subscription try to subscribe', () => {
    const { getByText } = setup()

    fireEvent.press(getByText('Subscribe for $9.99 month'))

    expect(dispatch).toBeCalledWith(purchasesActions.purchaseRequest({ productId: 'app.real.mobile.diamond1M' }))
  })

  it('submitting state', () => {
    purchasesSelectors.purchasesRequest.mockReturnValueOnce({ status: 'loading' })
    const { getByText } = setup()

    expect(getByText('Subscribe for $9.99 month')).toBeDisabled()
  })

  it('user with premium subscription try to unsubscribe', () => {
    jest.spyOn(Linking, 'openURL')

    authSelector.authUserSelector.mockReturnValueOnce(premiumUser)
    const { getByText } = setup()

    fireEvent.press(getByText('Unsubscribe'))

    expect(Linking.openURL).toBeCalledWith('https://apps.apple.com/account/subscriptions')
  })
})
