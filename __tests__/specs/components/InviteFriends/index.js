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
    const { getByText } = setup()

    fireEvent.press(getByText('Connect Contacts'))
    expect(contactsGetRequest).toHaveBeenCalled()
  })

  it('error state', () => {
    const error = 'Error'
    const contactsGet = { status: 'failure', error }
    const { getByText } = setup({ contactsGet })

    expect(getByText(error)).toBeTruthy()
    fireEvent.press(getByText('Connect Contacts'))
    expect(contactsGetRequest).toHaveBeenCalled()
  })

  it('loading state', () => {
    const contactsGet = { status: 'loading', error: '' }
    const { getByText } = setup({ contactsGet })

    expect(getByText('Connect Contacts')).toBeDisabled()
  })

  it('success state', () => {
    const contactsGet = { status: 'success', error: '' }
    const { getByText } = setup({ contactsGet })

    fireEvent.press(getByText('Synchronize Contacts'))
    expect(contactsGetRequest).toHaveBeenCalled()
  })
})
