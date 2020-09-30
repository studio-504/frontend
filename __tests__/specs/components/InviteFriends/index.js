import React from 'react'
import { Alert } from 'react-native'
import { renderWithProviders, fireEvent, within } from 'tests/utils'
import InviteFriendsComponent from 'components/InviteFriends'
import testIDs from 'components/InviteFriends/test-ids'

jest.spyOn(Alert, 'alert')

const emailAddresses = [{ email: 'text0@email.com' }, { email: 'text1@email.com' }, { email: 'text2@email.com' }]
const phoneNumbers = [{ number: '+199999999' }, { number: '+299999999' }, { number: '+399999999' }]

const items = [
  { recordID: '1', givenName: '', middleName: 'middle0', familyName: 'family0' },
  { recordID: '2', givenName: 'given1', middleName: '', familyName: 'family1' },
  { recordID: '3', givenName: 'given2', middleName: 'middle2', familyName: '' },
  { recordID: '4', givenName: 'given3', middleName: 'middle3', familyName: 'family3' },
].map((item) => ({ ...item, emailAddresses, phoneNumbers }))

const contactsGetRequest = jest.fn()
const requiredProps = {
  contactsGetRequest,
  contactsGet: { status: 'idle', error: '' },
  invited: { items: [] },
}

const setup = (props) => renderWithProviders(<InviteFriendsComponent {...requiredProps} {...props} />)

describe('Invite Friends Component', () => {
  afterEach(() => {
    contactsGetRequest.mockClear()
    Alert.alert.mockClear()
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

  describe('success state', () => {
    it('render rows', () => {
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

    it('invite callback', () => {
      const contactsInviteRequest = jest.fn()
      const contactsGet = { status: 'success', error: '', items }
      const { queryAllByTestId } = setup({ contactsGet, contactsInviteRequest })
      const $rows = queryAllByTestId(testIDs.row)

      contactsInviteRequest.mockClear()
      fireEvent.press(within($rows[0]).getByText('Invite'))

      expect(Alert.alert).toHaveBeenCalled()
      const [title, message, buttons, options] = Alert.alert.mock.calls[0]
      expect(title).toBe('Invite middle0 family0')
      expect(message).toBe('Сhoose a contact')
      expect(options).toEqual({ cancelable: true })

      expect(buttons.map((item) => item.text)).toEqual([
        'text0@email.com',
        'text1@email.com',
        'text2@email.com',
        '+199999999',
        '+299999999',
        '+399999999',
        'Cancel',
      ])

      buttons.forEach((btn) => {
        if (btn.text === 'Cancel') return

        contactsInviteRequest.mockClear()
        btn.onPress()
        expect(contactsInviteRequest).toHaveBeenCalled()
      })

      contactsInviteRequest.mockClear()
      buttons[0].onPress()
      expect(contactsInviteRequest).toHaveBeenCalledWith({
        contact: {
          type: 'email',
          value: 'text0@email.com',
        },
        user: items[0],
      })
    })

    it('direct callback when only one contact number', () => {
      const contactsInviteRequest = jest.fn()
      const user = {
        ...items[0],
        emailAddresses: [{ email: 'test@email.com' }],
        phoneNumbers: [],
      }
      const contactsGet = { status: 'success', error: '', items: [user] }
      const { getByText } = setup({ contactsGet, contactsInviteRequest })

      contactsInviteRequest.mockClear()
      fireEvent.press(getByText('Invite'))

      expect(Alert.alert).not.toHaveBeenCalled()
      expect(contactsInviteRequest).toHaveBeenCalledWith({
        contact: {
          type: 'email',
          value: 'test@email.com',
        },
        user,
      })
    })

    it('invited', () => {
      const invited = { items: [items[0].recordID, items[2].recordID] }
      const contactsGet = { status: 'success', error: '', items }
      const { queryAllByTestId } = setup({ contactsGet, invited })
      const $rows = queryAllByTestId(testIDs.row)

      expect(within($rows[0]).getByText('Invited')).toBeTruthy()
      expect(within($rows[1]).getByText('Invite')).toBeTruthy()
      expect(within($rows[2]).getByText('Invited')).toBeTruthy()
      expect(within($rows[3]).getByText('Invite')).toBeTruthy()
    })
  })
})
