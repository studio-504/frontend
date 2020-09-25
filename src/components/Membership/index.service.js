import { Linking } from 'react-native'
import { useDispatch, useSelector } from 'react-redux'
import * as purchasesActions from 'store/ducks/purchases/actions'
import * as purchasesConstants from 'store/ducks/purchases/constants'
import * as authSelector from 'store/ducks/auth/selectors'

const MembershipService = ({ children }) => {
  const dispatch = useDispatch()
  const user = useSelector(authSelector.authUserSelector)

  const isSubscribed = user.subscriptionLevel === purchasesConstants.DIAMOND
  const requestSubscription = () => dispatch(purchasesActions.purchaseRequest({productId: purchasesConstants.PRIMARY_SUBSCRIPTION}))
  const cancelSubscription = () => Linking.openURL('https://apps.apple.com/account/subscriptions')

  return children({
    requestSubscription,
    cancelSubscription,
    isSubscribed,
  })
}

export default MembershipService
