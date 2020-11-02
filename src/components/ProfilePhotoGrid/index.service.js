import React, { useEffect, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import * as usersActions from 'store/ducks/users/actions'
import * as authSelector from 'store/ducks/auth/selectors'
import * as navigationActions from 'navigation/actions'
import { useNavigation } from '@react-navigation/native'
import * as usersSelector from 'store/ducks/users/selectors'
import HeaderRight from 'navigation/HeaderRight'

const ProfilePhotoGridService = ({ children }) => {
  const dispatch = useDispatch()
  const navigation = useNavigation()
  const user = useSelector(authSelector.authUserSelector)
  const usersImagePostsGet = useSelector(usersSelector.usersImagePostsGetSelector())
  const usersEditProfile = useSelector((state) => state.users.usersEditProfile)

  const usersImagePostsGetRequest = (payload) => dispatch(usersActions.usersImagePostsGetRequest(payload))

  useEffect(() => {
    usersImagePostsGetRequest({ userId: user.userId })
  }, [])

  useEffect(() => {
    if (usersEditProfile.status === 'success') {
      navigationActions.navigateProfileSelf(navigation)()
      dispatch(usersActions.usersEditProfileIdle({}))
    }
  }, [usersEditProfile.status])

  const [selectedPost, setSelectedPost] = useState({})
  const handlePostPress = (post) => setSelectedPost(post)

  const usersEditProfileRequest = () => {
    dispatch(usersActions.usersEditProfileRequest({ photoPostId: selectedPost.postId }))
  }

  /**
   *
   */
  const headerRight = () => (
    <HeaderRight onPress={usersEditProfileRequest} title="Update" hidden={!selectedPost.postId} />
  )

  /**
   *
   */
  useEffect(() => {
    navigation.setOptions({
      headerRight,
    })
  }, [selectedPost.postId])

  return children({
    usersImagePostsGet,
    usersImagePostsGetRequest,
    handlePostPress,
    selectedPost,
    usersEditProfileRequest,
  })
}

export default ProfilePhotoGridService
