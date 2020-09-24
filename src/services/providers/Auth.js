import React, { useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import * as appActions from 'store/ducks/app/actions'
import * as authActions from 'store/ducks/auth/actions'
import * as usersActions from 'store/ducks/users/actions'
import * as subscriptionsActions from 'store/ducks/subscriptions/actions'
import * as authSelector from 'store/ducks/auth/selectors'
import useAppState from 'services/AppState'
import LoadingComponent from 'components/Loading'

/**
 * 
 */
export const AuthProvider = ({
  children,
}) => {
  const dispatch = useDispatch()
  const appReady = useSelector(state => state.app.appReady)
  const appTheme = useSelector(state => state.app.appTheme)
  const userId = useSelector(authSelector.authUserIdSelector)
  const authFlow = useSelector(state => state.auth.authFlow)
  const theme = useSelector(authSelector.themeSelector)
  const authSigninGoogle = useSelector(state => state.auth.authSigninGoogle)
  const authSigninApple = useSelector(state => state.auth.authSigninApple)
  const networkIsConnected = useSelector(state => state.network.isConnected)

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
   *
   */
  const handleRouteInit = (routeNameRef, navigationRef) => () => {
    routeNameRef.current = navigationRef.current.getCurrentRoute().name
  }

  const onStateChange = (routeNameRef, navigationRef) => () => {
    const previousRouteName = routeNameRef.current
    const currentRouteName = navigationRef.current.getCurrentRoute().name

    if (previousRouteName !== currentRouteName && userId) {
      dispatch(usersActions.usersReportScreenViewsRequest({ screens: [currentRouteName] }))
    }

    // Save the current route name for later comparision
    routeNameRef.current = currentRouteName
  } 

  /**
   * Constructor function to fetch: Translations, Themes and Auth data
   */
  useEffect(() => {
    dispatch(appActions.appReadyRequest())
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

  if (appReady.status !== 'success') {
    return <LoadingComponent />
  }

  return children({
    theme,
    themes: appTheme.data,
    authenticated: authFlow.meta.authenticated,
    appErrorMessage,
    handleErrorClose,
    networkIsConnected,
    handleRouteInit,
    onStateChange,
  })
}