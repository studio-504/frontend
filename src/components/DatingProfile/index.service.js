import { useEffect, useCallback } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import * as authSelector from 'store/ducks/auth/selectors'
import * as usersActions from 'store/ducks/users/actions'
import * as usersSelector from 'store/ducks/users/selectors'
import { useNavigation } from '@react-navigation/native'
import * as navigationActions from 'navigation/actions'
import { useFocusEffect } from '@react-navigation/native'

const DatingProfileService = ({ children }) => {
  const dispatch = useDispatch()
  const navigation = useNavigation()
  const user = useSelector(authSelector.authUserSelector)
  const usersSetUserDatingStatus = useSelector(usersSelector.usersSetUserDatingStatus)
  const usersImagePostsGet = useSelector(usersSelector.usersImagePostsGetSelector())

  const formErrorMessage = usersSetUserDatingStatus.error.text

  const handleErrorClose = () => {
    dispatch(usersActions.usersSetUserDatingStatusIdle())
  }

  const usersSetUserDatingStatusRequest = () =>
    dispatch(usersActions.usersSetUserDatingStatusRequest({ status: 'ENABLED' }))

  useEffect(() => {
    if (usersSetUserDatingStatus.status === 'success') {
      navigationActions.navigateDating(navigation)()
    }
  }, [usersSetUserDatingStatus.status])

  useEffect(() => {
    dispatch(usersActions.usersGetProfileSelfRequest())
    dispatch(usersActions.usersImagePostsGetRequest({ userId: user.userId, isVerified: true }))
  }, [])

  useFocusEffect(useCallback(() => handleErrorClose, []))

  return children({
    user,
    usersSetUserDatingStatus,
    usersSetUserDatingStatusRequest,
    formErrorMessage,
    handleErrorClose,
    usersImagePostsGet,
  })
}

export default DatingProfileService
