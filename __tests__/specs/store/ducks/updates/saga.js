import { Alert, Linking, NativeModules } from 'react-native'
import { expectSaga } from 'redux-saga-test-plan'
import DeviceInfo from 'react-native-device-info'
import Config from 'react-native-config'
import * as Logger from 'services/Logger'
import * as queryService from 'services/Query'
import { testAsRootSaga } from 'tests/utils/helpers'
import updates from 'store/ducks/updates/saga'
import * as updatesActions from 'store/ducks/updates/actions'

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

const setupSaga = () => expectSaga(testAsRootSaga(updates)).dispatch(updatesActions.updatesCheckRequest()).silentRun()

describe('Updates saga', () => {
  afterEach(() => {
    Alert.alert.mockClear()
    Linking.openURL.mockClear()
  })

  it('show update alert', async () => {
    await setupSaga()

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
      await setupSaga()

      expect(Alert.alert).not.toHaveBeenCalled()
      Config.ENVIRONMENT = 'production'
    })

    it('app store and current versions are equal', async () => {
      queryService.httpRequest.mockResolvedValueOnce({
        json: () => ({ resultCount: 1, results: [{ version: '1.0.0' }] }),
      })

      await setupSaga()

      expect(Alert.alert).not.toHaveBeenCalled()
    })

    it('current versions is newer than apple store version', async () => {
      DeviceInfo.getVersion.mockReturnValueOnce('1.0.1')
      queryService.httpRequest.mockResolvedValueOnce({
        json: () => ({ resultCount: 1, results: [{ version: '1.0.0' }] }),
      })

      await setupSaga()

      expect(Alert.alert).not.toHaveBeenCalled()
    })

    it('fetch app info failure', async () => {
      const error = new Error('Itunes store error')
      queryService.httpRequest.mockRejectedValueOnce(error)
      await setupSaga()

      expect(Alert.alert).not.toHaveBeenCalled()
      expect(Logger.captureException).toHaveBeenCalledWith(error)
    })
  })
})
