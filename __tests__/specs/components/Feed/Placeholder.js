import React from 'react'
import { renderWithStore, fireEvent } from 'tests/utils'
import { testNavigate } from 'tests/utils/helpers'
import { useNavigation } from '@react-navigation/native'
import Placeholder from 'components/Feed/Placeholder'
import { AuthProvider } from 'services/providers/Auth'
import * as authSelector from 'store/ducks/auth/selectors'

jest.spyOn(authSelector, 'authUserSelector').mockReturnValue({ userStatus: 'ACTIVE' })

jest.mock('@react-navigation/native', () => ({ useNavigation: jest.fn() }))
const navigation = { navigate: jest.fn() }
useNavigation.mockReturnValue(navigation)

const setup = () =>
  renderWithStore(
    <AuthProvider>
      <Placeholder />
    </AuthProvider>,
  )

describe('Feed Placeholder', () => {
  afterEach(() => {
    navigation.navigate.mockClear()
  })

  it('header', () => {
    const { getByText } = setup()

    expect(getByText('We couldn\'t find any posts in your feed')).toBeTruthy()
    expect(getByText('Follow & Invite Friends')).toBeTruthy()
    expect(getByText('Pull down to refresh')).toBeTruthy()
  })

  it('navigate anonymous user to ProfileUpgrade', () => {
    authSelector.authUserSelector.mockReturnValue({ userStatus: 'ANONYMOUS' })
    const { getByText } = setup()

    fireEvent.press(getByText('Follow & Invite Friends'))
    testNavigate(navigation, 'App.Root.ProfileUpgrade')
    authSelector.authUserSelector.mockReturnValue({ userStatus: 'ACTIVE' })
  })

  it('navigate user to invite friends screen', () => {
    const { getByText } = setup()

    fireEvent.press(getByText('Follow & Invite Friends'))
    testNavigate(navigation, 'App.Root.Home.Profile.InviteFriends')
  })
})
