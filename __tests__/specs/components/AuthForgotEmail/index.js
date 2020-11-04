import React from 'react'
import { renderWithProviders, fireEvent, within } from 'tests/utils'
import AuthForgotEmail from 'components/AuthForgotEmail'
import { testNavigate, testField } from 'tests/utils/helpers'
import { useNavigation } from '@react-navigation/native'
import testIDs from 'components/AuthForgotEmail/test-ids'

const navigation = { navigate: jest.fn() }

jest.mock('@react-navigation/native', () => ({ useNavigation: jest.fn() }))

useNavigation.mockReturnValue(navigation)

const setup = (props) => renderWithProviders(<AuthForgotEmail {...props} />)

describe('AuthForgotEmail', () => {
  afterEach(() => {
    navigation.navigate.mockClear()
  })

  describe('Layout', () => {
    it('header', () => {
      const { getByText } = setup()

      expect(getByText('Forgot Password')).toBeTruthy()
      expect(getByText('Reset your password')).toBeTruthy()
    })

    it('sign in link', () => {
      const { getByText } = setup()

      fireEvent.press(getByText('Already Have an Account? Log In'))
      testNavigate(navigation, 'Auth.Signin.AuthSigninEmail')
    })
  })

  describe('Error state', () => {
    it('error hidden by default', () => {
      const { queryByTestId } = setup()

      expect(queryByTestId(testIDs.error)).toBeFalsy()
    })

    it('display an error', () => {
      const formErrorMessage = 'formErrorMessage'
      const handleErrorClose = jest.fn()
      const { queryByTestId, getByText } = setup({ formErrorMessage, handleErrorClose })

      expect(getByText(formErrorMessage)).toBeTruthy()

      fireEvent.press(within(queryByTestId(testIDs.error)).getByAccessibilityRole('button'))
      expect(handleErrorClose).toHaveBeenCalled()
    })
  })

  describe('Form', () => {
    it('email field', () => {
      const { getByLabelText } = setup()

      testField(getByLabelText('email'), {
        testID: testIDs.form.email,
        accessibilityLabel: 'email',
        name: 'email',
        keyboardType: 'email-address',
        textContentType: 'emailAddress',
        autoCompleteType: 'email',
      })
    })

    it('submit button', () => {
      const { getByText } = setup()

      expect(getByText('Next')).toBeTruthy()
    })
  })
})
