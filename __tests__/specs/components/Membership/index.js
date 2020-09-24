import React from 'react'
import MembershipComponent from 'components/Membership'
import { renderWithProviders, fireEvent } from 'tests/utils'

const setup = (props) => renderWithProviders(<MembershipComponent {...props} />)

describe('Membership component', () => {
  it('header', () => {
    const { getByText } = setup()

    getByText('REAL Diamond')
    getByText('Membership Perks')
  })

  it('Membership Perks', () => {
    const { getByText } = setup()

    getByText('Profile Trending Boost')
    getByText('Boost your profile in trending photos')

    getByText('Dating Match Boost')
    getByText('Send your profile to the top of potential matchess')

    getByText('Profile Themes')
    getByText('Change the appearance of your profile')

    getByText('Live Chat Support')
    getByText('We\'re here to help!')

    getByText('Diamond Badge')
    getByText('A shiny badge next to your username')

    
  })

  it('Subscribe button', () => {
    const requestSubscription = jest.fn()
    const { getByText, queryByText } = setup({ requestSubscription })
    const $button = getByText('Subscribe for $9.99 month')

    expect(queryByText('Become a member today')).toBeTruthy()

    fireEvent.press($button)
    expect(requestSubscription).toHaveBeenCalled()
  })

  it('Unsubscribe button', () => {
    const cancelSubscription = jest.fn()
    const { getByText, queryByText } = setup({ cancelSubscription, isSubscribed: true })
    const $button = getByText('Unsubscribe')

    expect(queryByText('Become a member today')).not.toBeTruthy()

    fireEvent.press($button)
    expect(cancelSubscription).toHaveBeenCalled()
  })
})
