import React from 'react'
import PropTypes from 'prop-types'
import { useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import * as postsActions from 'store/ducks/posts/actions'
import * as subscriptionsActions from 'store/ducks/subscriptions/actions'
import * as authSelector from 'store/ducks/auth/selectors'
import useAppState from 'services/AppState'

export const AuthContext = React.createContext({})

/**
 * 
 */
export const AuthProvider = ({
  children,
}) => {
  const dispatch = useDispatch()
  const user = useSelector(authSelector.authUserSelector)
  const [swipeDisabled, setSwipeDisabled] = useState(false)
  
  const isUserActive = user.userStatus === 'ACTIVE'
  const swipeEnabled = isUserActive && !swipeDisabled

  /**
   * Application version check handler, which forces users to update
   * the app if new build is available
   */
  useAppState({
    onForeground: () => {
      if (user.userId) {
        dispatch(subscriptionsActions.subscriptionsMainRequest())
        dispatch(subscriptionsActions.subscriptionsPollRequest())
        dispatch(postsActions.postsFeedGetRequest())
      }
    },
    onBackground: () => {
      if (user.userId) {
        dispatch(subscriptionsActions.subscriptionsMainIdle())
        dispatch(subscriptionsActions.subscriptionsPollIdle())
      }
    },
  })

  return (
    <AuthContext.Provider value={{ user, swipeEnabled, setSwipeDisabled, isUserActive }}>
      {children}
    </AuthContext.Provider>
  )
}

AuthProvider.propTypes = {
  children: PropTypes.any,
}
