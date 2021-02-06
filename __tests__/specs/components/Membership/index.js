import React from 'react'
import MembershipComponent from 'components/Membership'
import { renderWithProviders, fireEvent } from 'tests/utils'

const error = 'Error'
const requiredProps = { purchasesRequest: { error: '' }, retryPurchase: { error: '' } }
const setup = (props) => renderWithProviders(<MembershipComponent {...requiredProps} {...props} />)

describe('Membership component', () => {
  it('header', () => {
    const { getByText } = setup()

    getByText('REAL Diamond')
    getByText('Membership Perks')
  })

  it('membership Perks', () => {
    const { getByText } = setup()

    getByText('Creator Payouts (coming soon)')
    getByText('We pay you for each view received on posts. Learn more')

    getByText('Profile Themes')
    getByText('Change the look and feel of your profile')

    getByText('Diamond Badge')
    getByText('A shiny badge next to your username')

    getByText('Profile Trending Boost')
    getByText('Your posts are more likely to become trending')

    getByText('Dating Match Boost')
    getByText('People are more likely to discover you in dating')

    getByText('Live Chat Support (coming soon)')
    getByText('Chat with us 24/7, we are at your service')
  })

  it('subscribe button', () => {
    const requestSubscription = jest.fn()
    const { getByText, queryByText } = setup({ requestSubscription })
    const $button = getByText('Subscribe for $0.99 month')

    expect(queryByText('Start with a 1 month free trial')).toBeTruthy()

    expect($button).toBeEnabled()
    fireEvent.press($button)
    expect(requestSubscription).toHaveBeenCalled()
  })

  it('subscribe submitting state', () => {
    const requestSubscription = jest.fn()
    const { getByText } = setup({ requestSubscription, purchasesRequest: { status: 'loading' } })
    const $button = getByText('Subscribe for $0.99 month')

    expect($button).toBeDisabled()
  })

  it('unsubscribe button', () => {
    const manageSubscriptions = jest.fn()
    const { getByText, queryByText } = setup({ manageSubscriptions, isSubscribed: true })
    const $button = getByText('Unsubscribe')

    expect(queryByText('Start with a 1 month free trial')).not.toBeTruthy()

    fireEvent.press($button)
    expect(manageSubscriptions).toHaveBeenCalled()
  })

  it('purchasesRequest error', () => {
    const retryPurchaseRequest = jest.fn()
    const { getByText, queryByText } = setup({ retryPurchaseRequest, purchasesRequest: { error } })
    const $button = getByText('Retry Subscription')

    getByText(error)

    expect(queryByText('Unsubscribe')).toBeFalsy()
    expect(queryByText('Subscribe for $0.99 month')).toBeFalsy()

    fireEvent.press($button)
    expect(retryPurchaseRequest).toHaveBeenCalled()
  })

  it('retryPurchase error', () => {
    const retryPurchaseRequest = jest.fn()
    const { getByText, queryByText } = setup({ retryPurchaseRequest, retryPurchase: { error } })
    const $button = getByText('Retry Subscription')

    getByText(error)

    expect(queryByText('Unsubscribe')).toBeFalsy()
    expect(queryByText('Subscribe for $0.99 month')).toBeFalsy()

    fireEvent.press($button)
    expect(retryPurchaseRequest).toHaveBeenCalled()
  })

  it('retryPurchase submitting state', () => {
    const retryPurchaseRequest = jest.fn()
    const { getByText } = setup({ retryPurchaseRequest, retryPurchase: { status: 'loading', error } })
    const $button = getByText('Retry Subscription')

    expect($button).toBeDisabled()
  })
})
