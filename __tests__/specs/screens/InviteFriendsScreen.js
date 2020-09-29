import React from 'react'
import { useDispatch } from 'react-redux'
import { renderWithProviders, fireEvent } from 'tests/utils'
import * as actions from 'store/ducks/contacts/actions'
import * as selectors from 'store/ducks/contacts/selectors'
import InviteFriendsScreen from 'screens/InviteFriendsScreen'

jest.mock('react-redux', () => ({ useDispatch: jest.fn(), useSelector: (fn) => fn() }))
jest.mock('store/ducks/contacts/selectors', () => ({ contactsGet: jest.fn() }))

const dispatch = jest.fn()
useDispatch.mockReturnValue(dispatch)
selectors.contactsGet.mockReturnValue({ status: 'idle', error: '' })

const setup = () => renderWithProviders(<InviteFriendsScreen />)

describe('Invite Friends screen', () => {
  afterEach(() => {
    dispatch.mockClear()
  })

  it('idle state', () => {
    const { getByText } = setup()

    fireEvent.press(getByText('Connect Contacts'))
    expect(dispatch).toHaveBeenCalledWith(actions.contactsGetRequest())
  })
})
