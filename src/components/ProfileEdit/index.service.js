import { useSelector, useDispatch } from 'react-redux'
import * as usersActions from 'store/ducks/users/actions'
import * as authSelector from 'store/ducks/auth/selectors'
import { useEffectWhenFocused } from 'services/hooks'

const ProfileEditService = ({ children }) => {
  const dispatch = useDispatch()
  const user = useSelector(authSelector.authUserSelector)
  const usersEditProfile = useSelector(state => state.users.usersEditProfile)

  const usersEditProfileRequest = (payload) =>
    dispatch(usersActions.usersEditProfileRequest(payload))

  useEffectWhenFocused(() => {
    if (usersEditProfile.status === 'success') {
      dispatch(usersActions.usersEditProfileIdle({}))
    }
  }, [usersEditProfile.status])

  return children({
    user,
    usersEditProfile,
    usersEditProfileRequest,
  })
}

export default ProfileEditService
