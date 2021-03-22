import React, { useEffect, useRef, useCallback } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import * as usersActions from 'store/ducks/users/actions'
import { useNavigation, useScrollToTop } from '@react-navigation/native'
import path from 'ramda/src/path'
import * as authSelector from 'store/ducks/auth/selectors'
import * as usersSelector from 'store/ducks/users/selectors'
import HeaderRight from 'components/ProfileSelf/Header'
import { useEffectWhenFocused } from 'services/hooks'

const ProfileSelfService = ({ children }) => {
  const dispatch = useDispatch()
  const navigation = useNavigation()
  const user = useSelector(authSelector.authUserSelector)
  const usersGetProfileSelf = useSelector(usersSelector.usersGetProfileSelfSelector)
  const username = path(['data', 'username'])(usersGetProfileSelf)

  const profileRef = useRef(null)
  useScrollToTop(profileRef)

  const headerRight = useCallback(
    () => <HeaderRight navigation={navigation} />,
    [navigation],
  )

  useEffect(() => {
    dispatch(usersActions.usersGetProfileSelfRequest())

    navigation.setOptions({ headerRight })
  }, [])

  useEffectWhenFocused(() => {
    if (username) {
      navigation.setOptions({ title: username })
    }
  }, [username])

  return children({
    user,
    profileRef,
    usersGetProfile: usersGetProfileSelf,
  })
}

export default ProfileSelfService
