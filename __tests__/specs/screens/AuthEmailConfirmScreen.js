import React from 'react'
import AuthEmailConfirmScreen from 'screens/AuthEmailConfirmScreen'
import { renderWithStore, fireEvent, act } from 'tests/utils'
import * as signupActions from 'store/ducks/signup/actions'
import { useRoute } from '@react-navigation/native'

jest.mock('@react-navigation/native', () => ({ useNavigation: jest.fn(), useRoute: jest.fn() }))
jest.spyOn(signupActions, 'signupConfirmRequest')
jest.spyOn(signupActions, 'signupConfirmIdle')

const email = 'valid@mail.com'
const confirmationCode = '123456'

const setup = () => {
  const actions = [signupActions.signupCreateRequest({ usernameType: 'email', email })]

  return renderWithStore(<AuthEmailConfirmScreen />, actions)
}

describe('AuthEmailConfirmScreen', () => {
  afterEach(() => {
    signupActions.signupConfirmRequest.mockClear()
    signupActions.signupConfirmIdle.mockClear()
  })

  it('header', () => {
    const { getByText } = setup()

    expect(getByText('Enter 6-digit code')).toBeTruthy()
    expect(getByText('Sent to valid@mail.com')).toBeTruthy()
  })

  it('get confirmationCode from route params', async () => {
    useRoute.mockReturnValueOnce({ params: { confirmationCode } })

    const { getByText } = setup()

    await act(async () => {
      fireEvent.press(getByText('Next'))
    })

    expect(signupActions.signupConfirmRequest).toHaveBeenCalledWith({
      confirmationCode: '123456',
      usernameType: 'email',
    })
  })

  it('submit form with valid values', async () => {
    const { getByText, getByLabelText } = setup()

    await act(async () => {
      fireEvent.changeText(getByLabelText('confirmationCode'), confirmationCode)
    })

    await act(async () => {
      fireEvent.press(getByText('Next'))
    })

    expect(signupActions.signupConfirmRequest).toHaveBeenCalledWith({
      confirmationCode: '123456',
      usernameType: 'email',
    })
  })

  it('clear reducer on unmount', () => {
    const { unmount } = setup()

    unmount()
    expect(signupActions.signupConfirmIdle).toHaveBeenCalled()
  })
})
