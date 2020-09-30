import React from 'react'
import { renderWithProviders, fireEvent, within } from 'tests/utils'
import InviteFriendsComponent from 'components/InviteFriends'
import testIDs from 'components/InviteFriends/test-ids'

const contactsGetRequest = jest.fn()
const requiredProps = { contactsGetRequest, contactsGet: { status: 'idle', error: '' } }
const setup = (props) => renderWithProviders(<InviteFriendsComponent {...requiredProps} {...props} />)

describe('Invite Friends Component', () => {
  afterEach(() => {
    contactsGetRequest.mockClear()
  })

  it('header', () => {
    const { getByText } = setup()

    getByText('Earn Free REAL Diamond')
    getByText('Follow or Invite 10 friends & get REAL Diamond FREE for 2 months!')
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

  it('empty state', () => {
    const contactsGet = { status: 'success', error: '', items: [] }
    const { queryByText } = setup({ contactsGet })

    expect(queryByText('Open the "Settings"')).toBeFalsy()
    expect(queryByText('Connect Contacts"')).toBeFalsy()
    expect(queryByText('There are no contacts. Pull down to refresh')).toBeTruthy()
  })

  it('success state', () => {
    const items = [
      { givenName: '', middleName: 'middle0', familyName: 'family0' },
      { givenName: 'given1', middleName: '', familyName: 'family1' },
      { givenName: 'given2', middleName: 'middle2', familyName: '' },
      { givenName: 'given3', middleName: 'middle3', familyName: 'family3' },
    ]
    const contactsGet = { status: 'success', error: '', items }
    const { queryByText, queryAllByTestId } = setup({ contactsGet })

    expect(queryByText('Open the "Settings"')).toBeFalsy()
    expect(queryByText('Connect Contacts"')).toBeFalsy()
    expect(queryByText('There are no contacts. Pull down to refresh')).toBeFalsy()

    const testRow = ($row, { fullName }) => {
      expect(within($row).queryByText(fullName)).toBeTruthy()
    }

    const $rows = queryAllByTestId(testIDs.row)

    expect($rows).toHaveLength(items.length)
    testRow($rows[0], { fullName: 'middle0 family0' })
    testRow($rows[1], { fullName: 'given1 family1' })
    testRow($rows[2], { fullName: 'given2 middle2' })
    testRow($rows[3], { fullName: 'given3 middle3 family3' })
  })
})
