import { useEffect } from 'react'
import { Alert, Linking } from 'react-native'
import { useDispatch, useSelector } from 'react-redux'
import RNIap, {
  finishTransaction,
  finishTransactionIOS,
  purchaseErrorListener,
  purchaseUpdatedListener,
} from 'react-native-iap'
import * as usersActions from 'store/ducks/users/actions'
import * as authSelector from 'store/ducks/auth/selectors'

const PRIMARY_SUBSCRIPTION = 'app.real.mobile.diamond1M'

const MembershipService = ({ children }) => {
  const dispatch = useDispatch()
  const user = useSelector(authSelector.authUserSelector)

	useEffect(() => {
		RNIap.initConnection()
    RNIap.getSubscriptions([PRIMARY_SUBSCRIPTION])
  }, [])

  /**
   *
   */
  const isSubscribed = user.subscriptionLevel === 'DIAMOND'

  /**
   *
   */
	const handlePurchaseUpdate = async (purchase) => {
    const receipt = purchase.transactionReceipt
    if (!receipt) {
      return
    }

    dispatch(usersActions.usersMembershipUpgradeRequest({ receiptData: purchase.transactionReceipt }))

    try {
      finishTransactionIOS(purchase.transactionId)
      await finishTransaction(purchase)
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
    isSubscribed,
  })
}

export default MembershipService
