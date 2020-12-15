import React, { useEffect } from 'react'
import PropTypes from 'prop-types'
import { useSelector, useDispatch } from 'react-redux'
import { useNavigation } from '@react-navigation/native'
import * as authSelector from 'store/ducks/auth/selectors'
import * as usersSelector from 'store/ducks/users/selectors'
import * as authActions from 'store/ducks/auth/actions'
import * as usersActions from 'store/ducks/users/actions'
import UploadAvatar from 'components/UploadAvatar'
import path from 'ramda/src/path'
import { useOTAVersion } from 'services/OTA'

const SettingsService = ({ children }) => {
  const dispatch = useDispatch()
  const navigation = useNavigation()
  const { appVersion } = useOTAVersion()

  const usersDeleteAvatar = useSelector(usersSelector.usersDeleteAvatar)
  const usersDelete = useSelector((state) => state.users.usersDelete)
  const settingsErrorMessage = path(['error', 'text'])(usersDeleteAvatar)
  const user = useSelector(authSelector.authUserSelector)

  const authSignoutRequest = () => dispatch(authActions.authSignoutRequest())
  const handleErrorClose = () => dispatch(usersActions.usersDeleteAvatarIdle({}))
  const authForgotRequest = () => dispatch(authActions.authForgotRequest({ username: user.email }))
  const usersDeleteRequest = () => dispatch(usersActions.usersDeleteRequest())

  useEffect(() => {
    if (usersDelete.status === 'success') {
      authSignoutRequest()
    }
  }, [usersDelete.status])

  return (
    <UploadAvatar backRoute="ProfileSelf">
      {({ openUploadAvatarMenu }) =>
        children({
          authSignoutRequest,
          navigation,
          handleErrorClose,
          settingsErrorMessage,
          user,
          openUploadAvatarMenu,
          authForgotRequest,
          appVersion,
          usersDelete,
          usersDeleteRequest,
        })
      }
    </UploadAvatar>
  )
}

SettingsService.propTypes = {
  children: PropTypes.any.isRequired,
}

export default SettingsService
