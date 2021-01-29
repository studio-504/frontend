import { Alert, Linking, NativeModules } from 'react-native'
import DeviceInfo from 'react-native-device-info'
import Config from 'react-native-config'
import * as Updates from 'services/Updates'
import * as Logger from 'services/Logger'
import * as queryService from 'services/Query'

jest.mock('services/Query', () => ({ httpRequest: jest.fn() }))
jest.mock('react-native-device-info', () => ({ getBundleId: jest.fn(), getVersion: jest.fn() }))
jest.mock('react-native-config', () => ({ ENVIRONMENT: 'production' }))
jest.spyOn(Alert, 'alert')
jest.spyOn(Linking, 'openURL')

DeviceInfo.getBundleId.mockReturnValue('app.real.mobile')
DeviceInfo.getVersion.mockReturnValue('1.0.0')
NativeModules.RNLocalize = { initialConstants: { country: 'en' } }

queryService.httpRequest.mockResolvedValue({
  json: () => ({ resultCount: 1, results: [{ version: '1.0.1' }] }),
})

describe('Updates service', () => {
  afterEach(() => {
    Alert.alert.mockClear()
    Linking.openURL.mockClear()
  })

  it('show update alert', async () => {
    await Updates.versionCheck()

    expect(Alert.alert).toHaveBeenCalled()
    const [title, desc, actions] = Alert.alert.mock.calls[0]

    expect(title).toBe('App Update Available')
    expect(desc).toBe('Please update REAL to continue')

    const updateBtn = actions[0]
    expect(updateBtn.text).toBe('Update Now')
    expect(updateBtn.style).toBe('cancel')

    updateBtn.onPress()
    expect(Linking.openURL).toHaveBeenCalledWith('itms-apps://itunes.apple.com/app/id1485194570')
  })

  describe('should not show alert when', () => {
    it('env development', async () => {
      Config.ENVIRONMENT = 'development'
      await Updates.versionCheck()

      expect(Alert.alert).not.toHaveBeenCalled()
      Config.ENVIRONMENT = 'production'
    })

    it('app store and current versions are equal', async () => {
      queryService.httpRequest.mockResolvedValueOnce({
        json: () => ({ resultCount: 1, results: [{ version: '1.0.0' }] }),
      })

      await Updates.versionCheck()

      expect(Alert.alert).not.toHaveBeenCalled()
    })

    it('fetch app info failure', async () => {
      const error = new Error('Itunes store error')
      queryService.httpRequest.mockRejectedValueOnce(error)
      await Updates.versionCheck()

      expect(Alert.alert).not.toHaveBeenCalled()
      expect(Logger.captureException).toHaveBeenCalledWith(error)
    })
  })
})
