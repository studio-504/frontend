import React from 'react'
import AuthEmailScreen from 'screens/AuthEmailScreen'
import { renderWithStore, fireEvent, act } from 'tests/utils'
import * as signupActions from 'store/ducks/signup/actions'
import { testField, testNavigate } from 'tests/utils/helpers'
import testIDs from 'components/AuthEmail/test-ids'
import * as Validation from 'services/Validation'
import { useNavigation } from '@react-navigation/native'

const navigation = { navigate: jest.fn() }

jest.mock('@react-navigation/native', () => ({ useNavigation: jest.fn(), useRoute: jest.fn() }))
jest.spyOn(signupActions, 'signupCreateIdle')
useNavigation.mockReturnValue(navigation)

const email = 'valid@mail.com'

const setup = () => {
  return renderWithStore(<AuthEmailScreen />)
}

describe('AuthEmailScreen', () => {
  afterEach(() => {
    signupActions.signupCreateIdle.mockClear()
  })

  it('header', () => {
    const { getByText } = setup()

    expect(getByText('Signup with Email Address')).toBeTruthy()
    expect(getByText('We\'ll send a code to verify')).toBeTruthy()
  })

  it('footer', () => {
    const { getByText } = setup()

    fireEvent.press(getByText('Already Have an Account? Log In'))
    testNavigate(navigation, 'Auth.Signin')
  })

  it('form', () => {
    const { getByLabelText } = setup()

    testField(getByLabelText('email'), {
      testID: testIDs.form.email,
      name: 'email',
      value: '',
      ...Validation.getInputTypeProps('email'),
    })
  })

  it('submit form with valid values', async () => {
    const signupCreateRequest = jest.spyOn(signupActions, 'signupCreateRequest')

    const { getByText, getByLabelText } = setup()

    await act(async () => {
      fireEvent.changeText(getByLabelText('email'), email)
    })

    await act(async () => {
      fireEvent.press(getByText('Next'))
    })

    expect(signupCreateRequest).toHaveBeenCalledWith({
      usernameType: 'email',
      email,
    })

    signupCreateRequest.mockRestore()
  })

  it('initial values', async () => {
    const { getByLabelText, store } = setup()

    await act(async () => {
      store.dispatch(signupActions.signupCreateRequest({ email }))
    })

    expect(getByLabelText('email').props.value).toBe(email)
  })

  it('loading state', async () => {
    const { store, getByText } = setup()

    await act(async () => {
      store.dispatch(signupActions.signupCreateRequest({}))
    })

    expect(getByText('Next')).toBeDisabled()
  })
})
