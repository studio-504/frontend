import { useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import * as authActions from 'store/ducks/auth/actions'
import * as subscriptionsActions from 'store/ducks/subscriptions/actions'
import * as authSelector from 'store/ducks/auth/selectors'
import useAppState from 'services/AppState'

/**
 * 
 */
export const AuthProvider = ({
  children,
}) => {
  const dispatch = useDispatch()
  const userId = useSelector(authSelector.authUserIdSelector)
  const authFlow = useSelector(state => state.auth.authFlow)
  const authSigninGoogle = useSelector(state => state.auth.authSigninGoogle)
  const authSigninApple = useSelector(state => state.auth.authSigninApple)

  const errorsPool = [{
    appErrorMessage: authSigninGoogle.error.text,
    handleErrorClose: () => dispatch(authActions.authSigninGoogleIdle()),
  }, {
    appErrorMessage: authSigninApple.error.text,
    handleErrorClose: () => dispatch(authActions.authSigninAppleIdle()),
  }]
  const { appErrorMessage, handleErrorClose } = errorsPool
    .filter(error => error.appErrorMessage && !error.appErrorMessage.length)
    .pop() || {}
  
  /**
   * Constructor function to fetch: Translations, Themes and Auth data
   */
  useEffect(() => {
    dispatch(authActions.authFlowRequest())
  }, [])

  const startApp = (userId) => {
    if(!userId) return

    dispatch(subscriptionsActions.subscriptionsMainRequest())
    dispatch(subscriptionsActions.subscriptionsPollRequest())
    dispatch(subscriptionsActions.subscriptionsPrefetchRequest())
  }

  /**
   * Application version check handler, which forces users to update
   * the app if new build is available
   */
  useAppState({
    onForeground: () => {
      startApp(userId)
    },
    onBackground: () => {
      if (userId) {
        dispatch(subscriptionsActions.subscriptionsMainIdle())
        dispatch(subscriptionsActions.subscriptionsPollIdle())
      }
    },
  })

  return children({
    authenticated: authFlow.meta.authenticated,
    appErrorMessage,
    handleErrorClose,
  })
}