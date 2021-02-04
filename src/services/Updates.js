import { Alert, Linking, NativeModules } from 'react-native'
import DeviceInfo from 'react-native-device-info'
import Config from 'react-native-config'
import * as Logger from 'services/Logger'
import * as queryService from 'services/Query'

export function isNewerThan(v1, v2) {
  v1 = v1.split('.')
  v2 = v2.split('.')
  for (var i = 0; i < Math.max(v1.length, v2.length); i++) {
    if (v1[i] == undefined) return false
    if (v2[i] == undefined) return true
    if (v1[i] > v2[i]) return true
    if (v1[i] < v2[i]) return false
  }
  return false
}

async function getVersionFromStore() {
  const bundleId = DeviceInfo.getBundleId()
  const country = NativeModules.RNLocalize.initialConstants.country

  const url = `https://itunes.apple.com/lookup?bundleId=${bundleId}&country=${country}`
  const response = await queryService.httpRequest(url, { cache: 'no-store' })
  const { resultCount, results } = await response.json()

  if (resultCount) {
    return results[0].version
  } else {
    throw new Error('There is no info about the app')
  }
}

async function needUpdate() {
  try {
    if (Config.ENVIRONMENT !== 'production') return

    const storeVersion = await getVersionFromStore()
    const currentVersion = DeviceInfo.getVersion()

    return isNewerThan(storeVersion, currentVersion)
  } catch (error) {
    Logger.captureException(error)
    return false
  }
}

export async function versionCheck() {
  if (await needUpdate()) {
    Alert.alert(
      'App Update Available',
      'Please update REAL to continue',
      [
        {
          text: 'Update Now',
          onPress: () => Linking.openURL('itms-apps://itunes.apple.com/app/id1485194570'),
          style: 'cancel',
        },
      ],
      { cancelable: false },
    )
  }
}
