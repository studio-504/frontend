import React from 'react'
import PropTypes from 'prop-types'
import { useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import * as postsActions from 'store/ducks/posts/actions'
import * as subscriptionsActions from 'store/ducks/subscriptions/actions'
import * as authSelector from 'store/ducks/auth/selectors'
import * as postsSelector from 'store/ducks/posts/selectors'
import useAppState from 'services/AppState'
import * as UserService from 'services/User'

export const AuthContext = React.createContext({})

/**
 * 
 */
export const AuthProvider = ({
  children,
}) => {
  const dispatch = useDispatch()
  const user = useSelector(authSelector.authUserSelector)
  const postsGetTrendingPosts = useSelector(postsSelector.postsGetTrendingPostsSelector())
  const [swipeDisabled, setSwipeDisabled] = useState(false)
  
  const isUserActive = UserService.isUserActive(user)
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

        if (postsGetTrendingPosts.status === 'failure') {
          dispatch(postsActions.postsGetTrendingPostsRequest())
        }
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
