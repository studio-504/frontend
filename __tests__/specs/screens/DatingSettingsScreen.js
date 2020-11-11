import React from 'react'
import DatingSettingsScreen from 'screens/DatingSettingsScreen'
import { renderWithStore } from 'tests/utils'
import * as RNPermissions from 'react-native-permissions'
import * as authSelector from 'store/ducks/auth/selectors'
import { useNavigation } from '@react-navigation/native'
import { testField } from 'tests/utils/helpers'
import { useHeader } from 'components/DatingSettings/header'

const user = {
  userId: 'id123',
  gender: 'MALE',
  fullName: 'fullName',
  dateOfBirth: '1990-04-21',
  disableDating: true,
  matchAgeRange: {
    min: 30,
    max: 40,
  },
  matchLocationRadius: 15,
  matchGenders: ['MALE'],
}

const setup = () => renderWithStore(<DatingSettingsScreen />)

jest.mock('@react-navigation/native', () => ({
  useNavigation: jest.fn(),
  useFocusEffect: jest.fn(),
}))

const navigation = { setOptions: jest.fn() }
useNavigation.mockReturnValue(navigation)

jest.mock('@react-native-community/geolocation', () => ({ getCurrentPosition: jest.fn() }))
jest.mock('components/DatingSettings/header', () => ({ useHeader: jest.fn() }))

jest.spyOn(RNPermissions, 'request').mockResolvedValue(true)
jest.spyOn(RNPermissions, 'check').mockResolvedValue(RNPermissions.RESULTS.GRANTED)
jest.spyOn(authSelector, 'authUserSelector').mockReturnValue(user)

describe('DatingSettingsScreen', () => {
  afterEach(() => {
    navigation.setOptions.mockClear()
  })

  it('default values', () => {
    authSelector.authUserSelector.mockReturnValue({})
    const { getByAccessibilityLabel, getByText } = setup()

    expect(getByText('Account Settings')).toBeTruthy()
    testField(getByAccessibilityLabel('dateOfBirthMonth'), { value: 'January' })
    testField(getByAccessibilityLabel('dateOfBirthDay'), { value: '01' })
    testField(getByAccessibilityLabel('dateOfBirthYear'), { value: '2000' })
    testField(getByAccessibilityLabel('gender'), { value: 'Your Gender' })
    testField(getByAccessibilityLabel('fullName'), { value: undefined })

    expect(getByText('Match Settings')).toBeTruthy()
    testField(getByAccessibilityLabel('matchAgeRangeMin'), { value: '18' })
    testField(getByAccessibilityLabel('matchAgeRangeMax'), { value: '23' })
    testField(getByAccessibilityLabel('matchGenders'), { value: 'Female' })
    testField(getByAccessibilityLabel('matchLocationRadius'), { value: '50 mi' })

    expect(getByText('Toggle Dating')).toBeTruthy()
    testField(getByAccessibilityLabel('disableDating'), { value: false })

    authSelector.authUserSelector.mockReturnValue(user)
  })

  it('values from profile', () => {
    const { getByAccessibilityLabel } = setup()

    testField(getByAccessibilityLabel('dateOfBirthMonth'), { value: 'April' })
    testField(getByAccessibilityLabel('dateOfBirthDay'), { value: '21' })
    testField(getByAccessibilityLabel('dateOfBirthYear'), { value: '1990' })
    testField(getByAccessibilityLabel('gender'), { value: 'Male' })
    testField(getByAccessibilityLabel('fullName'), { value: 'fullName' })
    testField(getByAccessibilityLabel('matchAgeRangeMin'), { value: '30' })
    testField(getByAccessibilityLabel('matchAgeRangeMax'), { value: '40' })
    testField(getByAccessibilityLabel('matchGenders'), { value: 'Male' })
    testField(getByAccessibilityLabel('matchLocationRadius'), { value: '15 mi' })
    testField(getByAccessibilityLabel('disableDating'), { value: true })
  })

  it('Submit button', () => {
    setup()

    expect(useHeader).toHaveBeenCalled()
    const { title, disabled } = useHeader.mock.calls[0][0]

    expect(title).toBe('Update')
    expect(disabled).toBe(false)
  })
})
