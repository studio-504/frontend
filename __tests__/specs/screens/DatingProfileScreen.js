import React from 'react'
import DatingProfileScreen from 'screens/DatingProfileScreen'
import { renderWithStore, act } from 'tests/utils'
import { testNavigate } from 'tests/utils/helpers'
import { useNavigation } from '@react-navigation/native'
import * as authSelector from 'store/ducks/auth/selectors'
import * as usersActions from 'store/ducks/users/actions'

const user = {
  userId: 'id123',
  gender: 'FEMALE',
  fullName: 'fullName',
  dateOfBirth: '1990-04-21',
  height: 170,
  bio: 'bio',
}

jest.spyOn(authSelector, 'authUserSelector').mockReturnValue(user)
jest.mock('@react-navigation/native', () => ({ useNavigation: jest.fn(), useFocusEffect: jest.fn() }))
jest.mock('components/Dating/Card', () => jest.fn().mockReturnValue(null))

const navigation = { navigate: jest.fn() }
useNavigation.mockReturnValue(navigation)

const setup = () => renderWithStore(<DatingProfileScreen />)

describe('DatingProfileScreen', () => {
  describe('Success state', () => {
    afterEach(() => {
      navigation.navigate.mockClear()
    })

    it('redirect to dating on success', async () => {
      const { store } = setup()

      await act(async () => {
        store.dispatch(usersActions.usersSetUserDatingStatusSuccess({ data: {}, payload: {} }))
      })

      testNavigate(navigation, 'Dating')
    })
  })
})
