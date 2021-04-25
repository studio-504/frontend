import PushNotificationIOS from '@react-native-community/push-notification-ios'
import { call, take, fork } from 'redux-saga/effects'
import * as constants from 'store/ducks/push/constants'
import * as authConstants from 'store/ducks/auth/constants'
import pushChannel from 'store/ducks/push/saga/pushChannel'
import * as Logger from 'services/Logger'
import * as LinkingService from 'services/Linking'
import * as NavigationService from 'services/Navigation'
import * as queryService from 'services/Query'
import * as queries from 'store/ducks/push/queries'
import path from 'ramda/src/path'

/**
 * Reset application badge number on completion
 */
function resetBadgeNumber() {
  try {
    PushNotificationIOS.setApplicationIconBadgeNumber(0)
  } catch (error) {
    Logger.captureException(error)
  }
}

/**
 * Register user's new apns token which allows
 * enables push notification on this device
 */
function* handleRegistrationEvent(token) {
  try {
    yield call([queryService, 'apiRequest'], queries.setUserAPNSToken, { token })

    Logger.withScope((scope) => {
      scope.setExtra('apns', token)
      Logger.captureMessage('PUSH_NOTIFICATION_REGISTER')
    })
  } catch (error) {
    Logger.captureException(error)
  }
}

/**
 * Log registration error
 */
function handleRegistrationError(error) {
  Logger.withScope((scope) => {
    scope.setExtra('payload', JSON.stringify(error))
    Logger.captureMessage('PUSH_NOTIFICATION_REGISTER_ERROR')
  })
}

function* handleNotificationEvent(notification) {
  try {
    /**
     * Let ios know that push notification is handled succesfully
     */
    notification.finish(PushNotificationIOS.FetchResult.NewData)

    /**
     * ios deeplinking payload structure, might change on other provider/client
     */
    const action = path(['data', 'pinpoint', 'deeplink'])(notification.getData())

    /**
     * Navigate to related screen if action is recognized and supported
     */
    if (LinkingService.isCardSupported({ action })) {
      const navigation = yield NavigationService.getNavigation()
      LinkingService.deeplinkNavigation(navigation)(action)
      yield call(resetBadgeNumber)
    }

    /**
     * Log unrecognized or unsupported actions
     */
    throw new Error('NOT_SUPPORTED_PUSH_NOTIFICATION')
  } catch (error) {
    Logger.captureException(error)
  }
}

function* pushStartRequest() {
  while (true) {
    yield take(constants.PUSH_START_REQUEST)
    yield call(resetBadgeNumber)

    try {
      const channel = yield call(pushChannel)

      yield fork(function* eventListener() {
        while (true) {
          const event = yield take(channel)

          if (event.type === 'REGISTER') {
            yield call(handleRegistrationEvent, event.token)
          }

          if (event.type === 'REGISTRATION_ERROR') {
            yield call(handleRegistrationError, event.error)
          }

          if (event.type === 'NOTIFICATION') {
            yield call(handleNotificationEvent, event.notification)
          }
        }
      })

      yield take(authConstants.AUTH_SIGNOUT_SUCCESS)
      channel.close()
    } catch (error) {
      Logger.captureException(error)
    }
  }
}

export default () => [call(pushStartRequest)]
