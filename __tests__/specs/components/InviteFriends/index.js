import React from 'react'
import { renderWithProviders, fireEvent } from 'tests/utils'
import InviteFriendsComponent from 'components/InviteFriends'

const contactsGetRequest = jest.fn()
const requiredProps = { contactsGetRequest, contactsGet: { status: 'idle', error: '' } }
const setup = (props) => renderWithProviders(<InviteFriendsComponent {...requiredProps} {...props} />)

describe('Invite Friends Component', () => {
  afterEach(() => {
    contactsGetRequest.mockClear()
  })

  it('header', () => {
    const { getByText } = setup()

    getByText('Connect Your Contacts')
    getByText('Find people you know on Real.app and choose who to follow.')
  })

  it('idle state', () => {
    const { queryByText } = setup()

    expect(queryByText('Open the "Settings"')).toBeFalsy()

    fireEvent.press(queryByText('Connect Contacts'))
    expect(contactsGetRequest).toHaveBeenCalled()
  })

  it('error state', () => {
    const error = 'Error'
    const contactsGet = { status: 'failure', error }
    const openSettings = jest.fn()
    const { queryByText } = setup({ contactsGet, openSettings })

    expect(queryByText(error)).toBeTruthy()
    expect(queryByText('Connect Contacts')).toBeFalsy()
    fireEvent.press(queryByText('Open the "Settings"'))
    expect(openSettings).toHaveBeenCalled()
  })

  it('loading state', () => {
    const contactsGet = { status: 'loading', error: '' }
    const { queryByText } = setup({ contactsGet })

    expect(queryByText('Connect Contacts')).toBeDisabled()
    expect(queryByText('Open the "Settings"')).toBeFalsy()
  })

  it('success state', () => {
    const contactsGet = { status: 'success', error: '' }
    const { queryByText } = setup({ contactsGet })

    expect(queryByText('Open the "Settings"')).toBeFalsy()
    expect(queryByText('Connect Contacts"')).toBeFalsy()
  })
})
