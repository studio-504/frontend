import React from 'react'
import DatingMatchScreen from 'screens/DatingMatchScreen'
import { renderWithStore, fireEvent, act } from 'tests/utils'
import * as RNPermissions from 'react-native-permissions'
import * as authSelector from 'store/ducks/auth/selectors'
import { testField, testNavigate } from 'tests/utils/helpers'
import * as usersActions from 'store/ducks/users/actions'
import { useNavigation, useRoute } from '@react-navigation/native'

const user = {
  matchAgeRange: {
    min: 30,
    max: 40,
  },
  matchHeightRange: {
    min: 90,
    max: 100,
  },
  matchLocationRadius: 15,
  matchGenders: ['MALE'],
}

const setup = () => renderWithStore(<DatingMatchScreen />)

jest.mock('@react-navigation/native', () => ({
  useNavigation: jest.fn(),
  useFocusEffect: jest.fn(),
  useRoute: jest.fn().mockReturnValue({ params: { nextAction: true } }),
}))

jest.mock('@react-native-community/geolocation', () => ({ getCurrentPosition: jest.fn() }))

jest.spyOn(RNPermissions, 'request').mockResolvedValue(true)
jest.spyOn(RNPermissions, 'check').mockResolvedValue(RNPermissions.RESULTS.GRANTED)
jest.spyOn(authSelector, 'authUserSelector').mockReturnValue(user)

const navigation = { navigate: jest.fn(), useRoute: jest.fn() }
useNavigation.mockReturnValue(navigation)

describe('DatingMatchScreen', () => {
  const openAllSections = (queryByAccessibilityLabel) => {
    fireEvent.press(queryByAccessibilityLabel('Toggle Match Gender'))
    fireEvent.press(queryByAccessibilityLabel('Toggle Match Location Range'))
  }

  describe('Form', () => {
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
      testField(queryByAccessibilityLabel('matchGenders'), { value: '' })
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

    it('opposite gender for male', () => {
      authSelector.authUserSelector.mockReturnValue({ gender: 'MALE' })
      const { queryByAccessibilityLabel } = setup()
      openAllSections(queryByAccessibilityLabel)

      testField(queryByAccessibilityLabel('matchGenders'), { value: 'Female' })

      authSelector.authUserSelector.mockReturnValue(user)
    })

    it('opposite gender for female', () => {
      authSelector.authUserSelector.mockReturnValue({ gender: 'FEMALE' })
      const { queryByAccessibilityLabel } = setup()
      openAllSections(queryByAccessibilityLabel)

      testField(queryByAccessibilityLabel('matchGenders'), { value: 'Male' })

      authSelector.authUserSelector.mockReturnValue(user)
    })

    it('submit form', async () => {
      const usersEditProfileRequest = jest.spyOn(usersActions, 'usersEditProfileRequest')
      const { getByText } = setup()

      await act(async () => {
        fireEvent.press(getByText('Next'))
      })

      expect(usersEditProfileRequest).toHaveBeenCalledWith({
        location: undefined,
        matchGenders: 'MALE',
        matchLocationRadius: 15,
        matchAgeRange: {
          max: 40,
          min: 30,
        },
        matchHeightRange: {
          max: 100,
          min: 90,
        },
      })

      usersEditProfileRequest.mockRestore()
    })
  })

  describe('Submitting state', () => {
    it('disable submit button', async () => {
      const { store, getByAccessibilityLabel } = setup()

      expect(getByAccessibilityLabel('Submit')).toBeEnabled()

      await act(async () => {
        store.dispatch(usersActions.usersEditProfileRequest({ data: {} }))
      })

      expect(getByAccessibilityLabel('Submit')).toBeDisabled()
    })
  })

  describe('Success state', () => {
    it('redirect next and clear state', async () => {
      const usersEditProfileIdle = jest.spyOn(usersActions, 'usersEditProfileIdle')
      const { store } = setup()

      await act(async () => {
        store.dispatch(usersActions.usersEditProfileSuccess({ data: {} }))
      })

      testNavigate(navigation, 'DatingProfile', { nextAction: true })
      expect(usersEditProfileIdle).toHaveBeenCalled()

      usersEditProfileIdle.mockRestore()
    })

    it('goBack when nextAction empty', async () => {
      const usersEditProfileIdle = jest.spyOn(usersActions, 'usersEditProfileIdle')
      useRoute.mockReturnValue({ params: {} })
      const { store, queryByText } = setup()

      expect(queryByText('Next')).toBeFalsy()
      expect(queryByText('Update')).toBeTruthy()

      await act(async () => {
        store.dispatch(usersActions.usersEditProfileSuccess({ data: {} }))
      })

      testNavigate(navigation, 'DatingSettings')
      expect(usersActions.usersEditProfileIdle).toHaveBeenCalled()
      usersEditProfileIdle.mockRestore()
      useRoute.mockReturnValue({ params: { nextAction: true } })
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
  })
})
