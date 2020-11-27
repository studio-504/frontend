import React, { useEffect, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import * as usersActions from 'store/ducks/users/actions'
import { useNavigation } from '@react-navigation/native'
import * as authSelector from 'store/ducks/auth/selectors'
import * as usersSelector from 'store/ducks/users/selectors'
import * as navigationActions from 'navigation/actions'
import UploadAvatar from 'components/UploadAvatar'
import propEq from 'ramda/src/propEq'
import path from 'ramda/src/path'

const getDisableDatingByStatus = propEq('datingStatus', 'DISABLED')
const getErrorText = path(['error', 'text'])

const DatingSettingsService = ({ children }) => {
  const dispatch = useDispatch()
  const navigation = useNavigation()
  const user = useSelector(authSelector.authUserSelector)
  const usersSetUserDatingStatus = useSelector(usersSelector.usersSetUserDatingStatus)
  const [disableDating, setDisableDating] = useState(getDisableDatingByStatus(user))

  const handleErrorClose = () => {
    dispatch(usersActions.usersSetUserDatingStatusIdle())
  }

  useEffect(() => {
    if (usersSetUserDatingStatus.status === 'failure') {
      setDisableDating(getDisableDatingByStatus(user))
    }
  }, [usersSetUserDatingStatus.status])

  useEffect(() => handleErrorClose, [])

  const toggleDatingStatusRequest = () => {
    const status = disableDating ? 'ENABLED' : 'DISABLED'
    dispatch(usersActions.usersSetUserDatingStatusRequest({ status }))
    setDisableDating(!disableDating)
  }

  const formErrorMessage = getErrorText(usersSetUserDatingStatus)

  const navigateDatingMatch = navigationActions.navigateDatingMatch(navigation)
  const navigateDatingAbout = navigationActions.navigateDatingAbout(navigation)
  const navigateMembership = () => navigationActions.navigateMembership(navigation)

  return (
    <UploadAvatar backRoute="DatingSettings">
      {({ openUploadAvatarMenu }) =>
        children({
          user,
          formErrorMessage,
          handleErrorClose,
          disableDating,
          toggleDatingStatusRequest,
          navigateDatingMatch,
          navigateDatingAbout,
          navigateMembership,
          openUploadAvatarMenu,
        })
      }
    </UploadAvatar>
  )
}

export default DatingSettingsService
