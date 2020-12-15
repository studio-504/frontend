import React from 'react'
import ProfileUpgradeScreen from 'screens/ProfileUpgradeScreen'
import { renderWithStore, fireEvent } from 'tests/utils'
import { testNavigate } from 'tests/utils/helpers'
import { useNavigation } from '@react-navigation/native'
import * as ReactRedux from 'react-redux'
import * as authActions from 'store/ducks/auth/actions'

jest.mock('@react-navigation/native', () => ({
  useNavigation: jest.fn(),
}))

const navigation = { navigate: jest.fn(), popToTop: jest.fn() }
useNavigation.mockReturnValue(navigation)

const setup = () => renderWithStore(<ProfileUpgradeScreen />)

describe('ProfileUpgradeScreen', () => {
  it('Log in button', () => {
    const { getByText } = setup()

    fireEvent.press(getByText('Already Have an Account? Log In'))
    testNavigate(navigation, 'Auth.Signin')
  })

  it('Browse Anonymously should be hidden', () => {
    const { queryByText } = setup()

    expect(queryByText('Browse Anonymously')).toBeFalsy()
  })

  describe('Sign Up buttons', () => {
    const dispatch = jest.fn()

    beforeAll(() => {
      jest.spyOn(ReactRedux, 'useDispatch')
      ReactRedux.useDispatch.mockReturnValue(dispatch)
    })

    afterAll(() => {
      ReactRedux.useDispatch.mockRestore()
    })

    afterEach(() => {
      dispatch.mockClear()
    })

    it('Google button', () => {
      const { getByText } = setup()

      fireEvent.press(getByText('Continue with Google'))
      expect(dispatch).toHaveBeenCalledWith(authActions.authSigninGoogleRequest())
    })

    it('Use Phone or Email button', () => {
      const { getByText } = setup()

      fireEvent.press(getByText('Use Phone or Email'))
      testNavigate(navigation, 'Auth.Signup')
    })

    it('Apple button', () => {
      const { getByText } = setup()

      fireEvent.press(getByText('Continue with Apple'))
      expect(dispatch).toHaveBeenCalledWith(authActions.authSigninAppleRequest())
    })
  })
})
