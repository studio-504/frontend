import * as RNIap from 'react-native-iap'
import { put, takeEvery, call, race, delay, take } from 'redux-saga/effects'
import { eventChannel } from 'redux-saga'
import * as actions from 'store/ducks/purchases/actions'
import * as constants from 'store/ducks/purchases/constants'
import * as queries from 'store/ducks/purchases/queries'
import * as queryService from 'services/Query'

/**
 *
 */
async function purchaseEmitter() {
  await RNIap.initConnection()

  return eventChannel((emitter) => {
    const handleSuccess = (purchase) => emitter({ eventType: 'success', eventData: { purchase } })
    const handleError = (error) => emitter({ eventType: 'error', eventData: { error } })

    const listeners = [
      RNIap.purchaseUpdatedListener(handleSuccess), 
      RNIap.purchaseErrorListener(handleError)
    ]

    return () => {
      listeners.forEach((listener) => listener.remove())
      RNIap.endConnection()
    }
  })
}

/**
 *
 */
function* purchaseComplete(purchase) {
  yield call(queryService.apiRequest, queries.addAppStoreReceipt, { receiptData: purchase.transactionReceipt })
  yield call([RNIap, 'finishTransactionIOS'], purchase.transactionId)
}

/**
 *
 */
function* purchaseRequest(req) {
  let channel

  try {
    const { productId } = req.payload
    const finishTransactionAutomatically = false

    channel = yield call(purchaseEmitter)

    yield call([RNIap, 'requestSubscription'], productId, finishTransactionAutomatically)

    const { timeout, response } = yield race({
      timeout: delay(10000),
      response: take(channel),
    })

    if (timeout) {
      throw new Error('Purchase Request Timeout')
    }

    const { eventType, eventData } = response

    if (eventType === 'error') {
      throw eventData.error
    }

    yield call(purchaseComplete, eventData.purchase)
    yield put(actions.purchaseSuccess())
  } catch (error) {
    yield put(actions.purchaseFailure(error.message))
  } finally {
    if (channel) {
      channel.close()
    }
  }
}

export default () => [takeEvery(constants.PURCHASE_REQUEST, purchaseRequest)]
