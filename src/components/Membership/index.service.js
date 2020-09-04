import { useEffect } from 'react'
import { Alert, Linking } from 'react-native'
import RNIap, {
  finishTransaction,
  finishTransactionIOS,
  purchaseErrorListener,
  purchaseUpdatedListener,
} from 'react-native-iap'

const PRIMARY_SUBSCRIPTION = 'diamond_subscription'

const MembershipService = ({ children }) => {
	useEffect(() => {
		RNIap.initConnection()
    RNIap.getSubscriptions([PRIMARY_SUBSCRIPTION])
	}, [])



  /**
   *
   */
	const handlePurchaseUpdate = async (purchase) => {
    const receipt = purchase.transactionReceipt
    if (!receipt) {
      return
    }

    console.log(purchase, 'purchase')

    try {
      finishTransactionIOS(purchase.transactionId)
      const ackResult = await finishTransaction(purchase)
      console.log(ackResult, 'ackResult')
    } catch (error) {
      console.warn('ackErr', error)
    }
  }

  /**
   *
   */
  const handlePurchaseError = async (error) => {
    Alert.alert(error.message)
  }

  /**
   *
   */
  useEffect(() => {
    const purchaseUpdateSubscription = purchaseUpdatedListener(handlePurchaseUpdate)
    const purchaseErrorSubscription = purchaseErrorListener(handlePurchaseError)

    return () => {
      purchaseUpdateSubscription.remove()
      purchaseErrorSubscription.remove()
      RNIap.endConnection()
    }
  }, [])

  const requestSubscription = async () => {
    try {
      RNIap.requestPurchase(PRIMARY_SUBSCRIPTION)
    } catch (err) {
      Alert.alert(err.message)
    }
  }

  const cancelSubscription = () => {
    Linking.openURL('https://apps.apple.com/account/subscriptions')
  }

  return children({
    requestSubscription,
    cancelSubscription,
  })
}

export default MembershipService
