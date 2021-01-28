import React from 'react'
import { renderWithProviders, fireEvent } from 'tests/utils'
import { testNavigate } from 'tests/utils/helpers'
import AboutComponent from 'components/Profile/About'

const setup = (props) => renderWithProviders(<AboutComponent {...props} />)

describe('Profile AboutComponent', () => {
  it('user has fullName', () => {
    const fullName = 'fullName'
    const usersGetProfile = { data: { fullName } }
    const { queryByText } = setup({ usersGetProfile })

    expect(queryByText(fullName)).toBeTruthy()
    expect(queryByText('Edit Profile')).toBeFalsy()
  })

  it('owner with empty fullName', () => {
    const navigation = { navigate: jest.fn() }
    const usersGetProfile = { data: { fullName: undefined, followedStatus: 'SELF' } }
    const { queryByText } = setup({ usersGetProfile, navigation })

    fireEvent.press(queryByText('Edit Profile'))

    testNavigate(navigation, 'App.Root.Home.Profile.ProfileEdit')
  })

  it('guest and profile with empty fullName', () => {
    const username = 'username'
    const usersGetProfile = { data: { fullName: undefined, followedStatus: 'FOLLOW', username } }
    const { queryByText } = setup({ usersGetProfile })

    expect(queryByText(username)).toBeTruthy()
    expect(queryByText('Edit Profile')).toBeFalsy()
  })
})
