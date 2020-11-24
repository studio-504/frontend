import React from 'react'
import { Button } from 'react-native'
import DatingSettingsScreen from 'screens/DatingSettingsScreen'
import { renderWithStore, act, fireEvent } from 'tests/utils'
import * as RNPermissions from 'react-native-permissions'
import * as authSelector from 'store/ducks/auth/selectors'
import { useNavigation } from '@react-navigation/native'
import { testField } from 'tests/utils/helpers'
import { useHeader } from 'components/DatingSettings/header'
import * as usersActions from 'store/ducks/users/actions'
import * as RNPaper from 'react-native-paper'

const getHeaderProps = () => useHeader.mock.calls[0][0]

jest
  .spyOn(RNPaper.Switch, 'render')
  .mockImplementation(({ onValueChange, accessibilityLabel, value }) => (
    <Button onPress={onValueChange} accessibilityLabel={accessibilityLabel} title={accessibilityLabel} value={value} />
  ))

const user = {
  userId: 'id123',
  gender: 'MALE',
  fullName: 'fullName',
  dateOfBirth: '1990-04-21',
  disableStatus: 'ENABLED',
  matchAgeRange: {
    min: 30,
    max: 40,
  },
  matchHeightRange: {
    min: 140,
    max: 180,
  },
  matchLocationRadius: 15,
  matchGenders: ['MALE'],
  bio: 'Bio',
  height: 170,
}

const setup = () => renderWithStore(<DatingSettingsScreen />)

jest.mock('@react-navigation/native', () => ({
  useNavigation: jest.fn(),
  useFocusEffect: jest.fn(),
}))

const navigation = { setOptions: jest.fn(), goBack: jest.fn() }
useNavigation.mockReturnValue(navigation)

jest.mock('@react-native-community/geolocation', () => ({ getCurrentPosition: jest.fn() }))
jest.mock('components/DatingSettings/header', () => ({ useHeader: jest.fn() }))

jest.spyOn(RNPermissions, 'request').mockResolvedValue(true)
jest.spyOn(RNPermissions, 'check').mockResolvedValue(RNPermissions.RESULTS.GRANTED)
jest.spyOn(authSelector, 'authUserSelector').mockReturnValue(user)

describe('DatingSettingsScreen', () => {
  afterEach(() => {
    navigation.setOptions.mockClear()
    navigation.goBack.mockClear()
    useHeader.mockClear()
  })

  describe('Form', () => {
    it('default values', () => {
      authSelector.authUserSelector.mockReturnValue({})
      const { getByAccessibilityLabel, getByText } = setup()

      expect(getByText('Account Settings')).toBeTruthy()
      testField(getByAccessibilityLabel('dateOfBirthMonth'), { value: 'January' })
      testField(getByAccessibilityLabel('dateOfBirthDay'), { value: '01' })
      testField(getByAccessibilityLabel('dateOfBirthYear'), { value: '2000' })
      testField(getByAccessibilityLabel('gender'), { value: '' })
      testField(getByAccessibilityLabel('fullName'), { value: undefined })
      testField(getByAccessibilityLabel('bio'), { value: undefined })
      testField(getByAccessibilityLabel('height'), { value: '' })

      expect(getByText('Match Settings')).toBeTruthy()
      testField(getByAccessibilityLabel('matchAgeRangeMin'), { value: '18' })
      testField(getByAccessibilityLabel('matchAgeRangeMax'), { value: '23' })
      testField(getByAccessibilityLabel('matchHeightRangeMin'), { value: '' })
      testField(getByAccessibilityLabel('matchHeightRangeMax'), { value: '' })
      testField(getByAccessibilityLabel('matchGenders'), { value: '' })
      testField(getByAccessibilityLabel('matchLocationRadius'), { value: '50 mi' })

      expect(getByText('Toggle Dating')).toBeTruthy()
      expect(getByAccessibilityLabel('disableDating')).toBeTruthy()

      authSelector.authUserSelector.mockReturnValue(user)
    })

    it('values from profile', () => {
      const { getByAccessibilityLabel } = setup()

      testField(getByAccessibilityLabel('dateOfBirthMonth'), { value: 'April' })
      testField(getByAccessibilityLabel('dateOfBirthDay'), { value: '21' })
      testField(getByAccessibilityLabel('dateOfBirthYear'), { value: '1990' })
      testField(getByAccessibilityLabel('gender'), { value: 'Male' })
      testField(getByAccessibilityLabel('fullName'), { value: 'fullName' })
      testField(getByAccessibilityLabel('bio'), { value: 'Bio' })
      testField(getByAccessibilityLabel('height'), { value: '170 cm' })
      testField(getByAccessibilityLabel('matchAgeRangeMin'), { value: '30' })
      testField(getByAccessibilityLabel('matchAgeRangeMax'), { value: '40' })
      testField(getByAccessibilityLabel('matchHeightRangeMin'), { value: '140 cm' })
      testField(getByAccessibilityLabel('matchHeightRangeMax'), { value: '180 cm' })
      testField(getByAccessibilityLabel('matchGenders'), { value: 'Male' })
      testField(getByAccessibilityLabel('matchLocationRadius'), { value: '15 mi' })
      
    })

    it('submit form', async () => {
      const usersEditProfileRequest = jest.spyOn(usersActions, 'usersEditProfileRequest')
      setup()

      expect(useHeader).toHaveBeenCalled()
      const { title, onPress } = getHeaderProps()

      expect(title).toBe('Update')

      await act(async () => {
        onPress()
      })

      expect(usersEditProfileRequest).toHaveBeenCalledWith({
        height: 170,
        bio: 'Bio',
        dateOfBirth: '1990-04-21',
        disableDating: undefined,
        fullName: 'fullName',
        gender: 'MALE',
        location: undefined,
        matchAgeRange: { max: 40, min: 30 },
        matchGenders: 'MALE',
        matchLocationRadius: 15,
        matchHeightRange: { max: 180, min: 140 },
      })

      usersEditProfileRequest.mockRestore()
    })
  })

  describe('Submitting state', () => {
    it('disable submit button', async () => {
      const { store } = setup()

      expect(getHeaderProps().disabled).toBe(false)
      useHeader.mockClear()

      await act(async () => {
        store.dispatch(usersActions.usersEditProfileRequest({ data: {} }))
      })

      expect(getHeaderProps().disabled).toBe(true)
    })
  })

  describe('Success state', () => {
    it('redirect back and clear state', async () => {
      const usersEditProfileIdle = jest.spyOn(usersActions, 'usersEditProfileIdle')
      const usersSetUserDatingStatusIdle = jest.spyOn(usersActions, 'usersSetUserDatingStatusIdle')

      const { store } = setup()

      await act(async () => {
        store.dispatch(usersActions.usersEditProfileSuccess({ data: {} }))
      })

      expect(navigation.goBack).toHaveBeenCalled()
      expect(usersEditProfileIdle).toHaveBeenCalled()
      expect(usersSetUserDatingStatusIdle).toHaveBeenCalled()

      usersEditProfileIdle.mockRestore()
      usersSetUserDatingStatusIdle.mockRestore()
    })

    it('clear state on unmount', () => {
      const usersEditProfileIdle = jest.spyOn(usersActions, 'usersEditProfileIdle')
      const usersSetUserDatingStatusIdle = jest.spyOn(usersActions, 'usersSetUserDatingStatusIdle')

      const { unmount } = setup()

      unmount()

      expect(usersEditProfileIdle).toHaveBeenCalled()
      expect(usersSetUserDatingStatusIdle).toHaveBeenCalled()

      usersEditProfileIdle.mockRestore()
      usersSetUserDatingStatusIdle.mockRestore()
    })
  })

  describe('Error state', () => {
    it('toggle usersEditProfile error', async () => {
      const error = 'Error'
      const { store, queryByText, getByLabelText } = setup()

      await act(async () => {
        store.dispatch(usersActions.usersEditProfileFailure({ message: { text: error } }))
      })

      expect(queryByText(error)).toBeTruthy()

      await act(async () => {
        fireEvent.press(getByLabelText('Close error'))
      })

      expect(queryByText(error)).toBeFalsy()
    })

    it('toggle usersSetUserDatingStatus error', async () => {
      const error = 'Error'
      const { store, queryByText, getByLabelText } = setup()

      await act(async () => {
        store.dispatch(usersActions.usersSetUserDatingStatusFailure({ message: { text: error } }))
      })

      expect(queryByText(error)).toBeTruthy()

      await act(async () => {
        fireEvent.press(getByLabelText('Close error'))
      })

      expect(queryByText(error)).toBeFalsy()
    })
  })

  describe('Toggle Dating', () => {
    it('toggleDatingStatusRequest', async () => {
      const usersSetUserDatingStatusRequest = jest.spyOn(usersActions, 'usersSetUserDatingStatusRequest')
      const { getByAccessibilityLabel } = setup()

      await act(async () => {
        fireEvent.press(getByAccessibilityLabel('disableDating'))
      })

      expect(usersSetUserDatingStatusRequest).toHaveBeenCalledWith({ status: 'DISABLED' })

      await act(async () => {
        usersSetUserDatingStatusRequest.mockClear()
        fireEvent.press(getByAccessibilityLabel('disableDating'))
      })

      expect(usersSetUserDatingStatusRequest).toHaveBeenCalledWith({ status: 'ENABLED' })

      usersSetUserDatingStatusRequest.mockRestore()
    })
  })
})
