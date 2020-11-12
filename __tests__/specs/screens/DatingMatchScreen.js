import React from 'react'
import DatingMatchScreen from 'screens/DatingMatchScreen'
import { renderWithStore, fireEvent } from 'tests/utils'
import * as RNPermissions from 'react-native-permissions'
import * as authSelector from 'store/ducks/auth/selectors'
import { testField } from 'tests/utils/helpers'

const user = {
  matchAgeRange: {
    min: 30,
    max: 40,
  },
  matchLocationRadius: 15,
  matchGenders: ['MALE'],
}

const setup = () => renderWithStore(<DatingMatchScreen />)

jest.mock('@react-navigation/native', () => ({
  useNavigation: jest.fn(),
  useFocusEffect: jest.fn(),
}))

jest.mock('@react-native-community/geolocation', () => ({ getCurrentPosition: jest.fn() }))

jest.spyOn(RNPermissions, 'request').mockResolvedValue(true)
jest.spyOn(RNPermissions, 'check').mockResolvedValue(RNPermissions.RESULTS.GRANTED)
jest.spyOn(authSelector, 'authUserSelector').mockReturnValue(user)

describe('DatingMatchScreen', () => {
  const openAllSections = (queryByAccessibilityLabel) => {
    fireEvent.press(queryByAccessibilityLabel('Toggle Match Gender'))
    fireEvent.press(queryByAccessibilityLabel('Toggle Match Location Range'))
  }

  it('toggle collapsed sections', () => {
    const { queryByAccessibilityLabel } = setup()

    expect(queryByAccessibilityLabel('matchAgeRangeMin')).toBeTruthy()
    expect(queryByAccessibilityLabel('matchAgeRangeMax')).toBeTruthy()
    fireEvent.press(queryByAccessibilityLabel('Toggle Match Age'))
    expect(queryByAccessibilityLabel('matchAgeRangeMin')).toBeFalsy()
    expect(queryByAccessibilityLabel('matchAgeRangeMax')).toBeFalsy()

    expect(queryByAccessibilityLabel('matchGenders')).toBeFalsy()
    fireEvent.press(queryByAccessibilityLabel('Toggle Match Gender'))
    expect(queryByAccessibilityLabel('matchGenders')).toBeTruthy()

    expect(queryByAccessibilityLabel('matchLocationRadius')).toBeFalsy()
    fireEvent.press(queryByAccessibilityLabel('Toggle Match Location Range'))
    expect(queryByAccessibilityLabel('matchLocationRadius')).toBeTruthy()
  })

  it('default values', () => {
    authSelector.authUserSelector.mockReturnValue({})
    const { queryByAccessibilityLabel } = setup()
    openAllSections(queryByAccessibilityLabel)

    testField(queryByAccessibilityLabel('matchAgeRangeMin'), { value: '18' })
    testField(queryByAccessibilityLabel('matchAgeRangeMax'), { value: '23' })
    testField(queryByAccessibilityLabel('matchGenders'), { value: 'Female' })
    testField(queryByAccessibilityLabel('matchLocationRadius'), { value: '50 mi' })

    authSelector.authUserSelector.mockReturnValue(user)
  })

  it('values from profile', () => {
    const { queryByAccessibilityLabel } = setup()
    openAllSections(queryByAccessibilityLabel)

    testField(queryByAccessibilityLabel('matchAgeRangeMin'), { value: '30' })
    testField(queryByAccessibilityLabel('matchAgeRangeMax'), { value: '40' })
    testField(queryByAccessibilityLabel('matchGenders'), { value: 'Male' })
    testField(queryByAccessibilityLabel('matchLocationRadius'), { value: '15 mi' })
  })
})
