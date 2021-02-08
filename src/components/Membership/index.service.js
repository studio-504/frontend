import { Linking } from 'react-native'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigation } from '@react-navigation/native'
import * as navigationActions from 'navigation/actions'
import * as purchasesActions from 'store/ducks/purchases/actions'
import * as purchasesConstants from 'store/ducks/purchases/constants'
import * as purchasesSelectors from 'store/ducks/purchases/selectors'
import * as authSelector from 'store/ducks/auth/selectors'

const MembershipService = ({ children }) => {
  const dispatch = useDispatch()
  const navigation = useNavigation()
  const user = useSelector(authSelector.authUserSelector)
  const purchasesRequest = useSelector(purchasesSelectors.purchasesRequest)
  const retryPurchase = useSelector(purchasesSelectors.retryPurchase)

  const subscription = { productId: purchasesConstants.PRIMARY_SUBSCRIPTION }
  const isSubscribed = user.subscriptionLevel === purchasesConstants.SUBSCRIPTION_LEVEL.DIAMOND
  const requestSubscription = () => dispatch(purchasesActions.purchaseRequest(subscription))
  const retryPurchaseRequest = () => dispatch(purchasesActions.retryPurchaseRequest(subscription))
  const manageSubscriptions = () => Linking.openURL('https://apps.apple.com/account/subscriptions')
  const handleContactUs = () => Linking.openURL('mailto:support@real.app')
  const navigateInviteFriends = navigationActions.navigateInviteFriends(navigation)

  return children({
    isSubscribed,
    purchasesRequest,
    retryPurchase,
    requestSubscription,
    manageSubscriptions,
    handleContactUs,
    retryPurchaseRequest,
    navigateInviteFriends,
  })
}

export default MembershipService
