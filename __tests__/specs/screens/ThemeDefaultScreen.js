import React from 'react'
import ThemeDefaultScreen from 'screens/ThemeDefaultScreen'
import { renderWithStore, fireEvent } from 'tests/utils'
import { useNavigation } from '@react-navigation/native'
import * as ReactRedux from 'react-redux'
import * as themesActions from 'store/ducks/themes/actions'
import testIDs from 'components/ThemeDefault/test-ids'
 
jest.mock('@react-navigation/native', () => ({
  useNavigation: jest.fn(),
}))

const navigation = { popToTop: jest.fn() }
useNavigation.mockReturnValue(navigation)

const setup = () => renderWithStore(<ThemeDefaultScreen />)

describe('ThemeDefaultScreen', () => {
  const dispatch = jest.fn()

  beforeAll(() => {
    jest.spyOn(ReactRedux, 'useDispatch')
    ReactRedux.useDispatch.mockReturnValue(dispatch)
  })

  afterAll(() => {
    ReactRedux.useDispatch.mockRestore()
  })

  afterEach(() => {
    navigation.popToTop.mockClear()
    dispatch.mockClear()
  })

  it('Enable dark mode', () => {
    const { getByText } = setup()

    fireEvent.press(getByText('Enable'))

    expect(dispatch).toHaveBeenCalledWith(themesActions.themesEditRequest({ themeCode: 'black.green' }))
    expect(navigation.popToTop).toHaveBeenCalled()
  })

  it('Skip dark mode', () => {
    const { getByText } = setup()

    fireEvent.press(getByText('Skip'))

    expect(dispatch).toHaveBeenCalledWith(themesActions.themesEditRequest({ themeCode: 'white.green' }))
    expect(navigation.popToTop).toHaveBeenCalled()
  })

  it('Close modal', () => {
    const { getByTestId } = setup()

    fireEvent.press(getByTestId(testIDs.backdrop))

    expect(dispatch).toHaveBeenCalledWith(themesActions.themesEditRequest({ themeCode: 'white.green' }))
    expect(navigation.popToTop).toHaveBeenCalled()
  })
})
