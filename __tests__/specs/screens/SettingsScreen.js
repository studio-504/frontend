import React from 'react'
import SettingsScreen from 'screens/SettingsScreen'
import { renderWithStore, act } from 'tests/utils'
import { sleep } from 'tests/utils/helpers'
import { useNavigation } from '@react-navigation/native'
import * as authSelector from 'store/ducks/auth/selectors'
import codePush from 'react-native-code-push'
import DeviceInfo from 'react-native-device-info'
import * as Logger from 'services/Logger'

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
jest.mock('react-native-code-push', () => ({ getUpdateMetadata: jest.fn() }))
jest.mock('react-native-device-info', () => ({ getReadableVersion: jest.fn() }))
jest.mock('components/ActionSheet', () => jest.fn().mockReturnValue(null))
jest.mock('components/Alert', () => ({ confirm: jest.fn() }))
jest.mock('templates/Avatar', () => () => null)
jest.mock('templates/SettingsAvatar', () => () => null)

const navigation = { navigate: jest.fn() }
useNavigation.mockReturnValue(navigation)

const OTAVersion = '123'
codePush.getUpdateMetadata.mockResolvedValue({ label: OTAVersion })

const appVersion = '987'
DeviceInfo.getReadableVersion.mockReturnValue(appVersion)

const setup = () => renderWithStore(<SettingsScreen />)

describe('SettingsScreen', () => {
  describe('App Version', () => {
    afterEach(() => {
      Logger.captureException.mockClear()
    })

    it('only app version by default', async () => {
      codePush.getUpdateMetadata.mockResolvedValueOnce(undefined)

      const { getByText } = setup()
      await act(() => sleep())

      expect(getByText(`v${appVersion}`)).toBeTruthy()
    })

    it('app + ota version', async () => {
      const { getByText } = setup()
      await act(() => sleep())

      expect(getByText(`v${appVersion}/${OTAVersion}`)).toBeTruthy()
    })

    it('display app version on get ota version error', async () => {
      const error = new Error('OTA get error')
      codePush.getUpdateMetadata.mockRejectedValueOnce(error)

      const { getByText } = setup()
      await act(() => sleep())

      expect(getByText(`v${appVersion}`)).toBeTruthy()
      expect(Logger.captureException).toHaveBeenCalledWith(error)
    })
  })
})
