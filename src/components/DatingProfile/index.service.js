import { useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import * as authSelector from 'store/ducks/auth/selectors'
import * as usersActions from 'store/ducks/users/actions'
import * as usersSelector from 'store/ducks/users/selectors'
import { useNavigation } from '@react-navigation/native'
import * as navigationActions from 'navigation/actions'

const DatingProfileService = ({ children }) => {
  const dispatch = useDispatch()
  const navigation = useNavigation()
  const user = useSelector(authSelector.authUserSelector)
  const usersSetUserDatingStatus = useSelector(usersSelector.usersSetUserDatingStatus)

  const formErrorMessage = usersSetUserDatingStatus.error.text

  const handleErrorClose = () => {
    dispatch(usersActions.usersSetUserDatingStatusIdle())
  }

  const usersSetUserDatingStatusRequest = () =>
    dispatch(usersActions.usersSetUserDatingStatusRequest({ status: 'ENABLED' }))

  useEffect(() => {
    if (usersSetUserDatingStatus.status === 'success') {
      navigationActions.navigateDating(navigation)
    }
  }, [usersSetUserDatingStatus.status])

  useEffect(() => {  
    dispatch(usersActions.usersGetProfileSelfRequest())
  }, [])

  useEffect(() => handleErrorClose, [])

  return children({
    user,
    usersSetUserDatingStatus,
    usersSetUserDatingStatusRequest,
    formErrorMessage,
    handleErrorClose,
  })
}

export default DatingProfileService
