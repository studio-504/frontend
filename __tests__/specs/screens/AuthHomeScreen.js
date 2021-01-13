import React from 'react'
import AuthHomeScreen from 'screens/AuthHomeScreen'
import { renderWithStore, fireEvent } from 'tests/utils'
import { testNavigate } from 'tests/utils/helpers'
import { useNavigation } from '@react-navigation/native'
import * as ReactRedux from 'react-redux'
import * as authActions from 'store/ducks/auth/actions'

jest.mock('@react-navigation/native', () => ({
  useNavigation: jest.fn(),
}))

const navigation = { navigate: jest.fn() }
useNavigation.mockReturnValue(navigation)

const setup = () => renderWithStore(<AuthHomeScreen />)

describe('AuthHomeScreen', () => {
  it('Log in button', () => {
    const { getByText } = setup()

    fireEvent.press(getByText('Already Have an Account? Log In'))
    testNavigate(navigation, 'Auth.Signin')
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

    it('Browse Anonymously', () => {
      const { getByText } = setup()

      fireEvent.press(getByText('Browse Anonymously'))
      expect(dispatch).toHaveBeenCalledWith(authActions.authSigninAnonymousRequest())
    })
  })
})
