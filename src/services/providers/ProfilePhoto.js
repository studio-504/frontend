import { useContext } from 'react'
import { useDispatch } from 'react-redux'
import { useNavigation } from '@react-navigation/native'
import * as cameraActions from 'store/ducks/camera/actions'
import * as navigationActions from 'navigation/actions'
import useCamera from 'services/providers/Camera'
import { AuthContext } from 'services/providers/Auth'
import * as usersActions from 'store/ducks/users/actions'
import * as helpers from 'components/UploadAvatar/helpers'

function useProfilePhoto() {
  const dispatch = useDispatch()
  const navigation = useNavigation()
  const { user } = useContext(AuthContext)
  const isAvatarEmpty = helpers.isAvatarEmpty(user)

  const camera = useCamera({
    handleProcessedPhoto: (payload) => {
      dispatch(cameraActions.cameraCaptureRequest(payload))
      navigationActions.navigateProfilePhotoUpload(navigation, { type: 'IMAGE', photos: [payload[0].preview] })()
    },
  })

  const handleCameraSnap = navigationActions.navigateCamera(
    navigation,
    { nextRoute: 'ProfilePhotoUpload' },
    { protected: true, user },
  )
  const handleSkipUpload = () => navigation.replace('Settings')
  const handleLibrarySnap = () => camera.handleLibrarySnap()
  const navigateProfilePhotoGrid = () => navigationActions.navigateProfilePhotoGrid(navigation)
  const usersDeleteAvatarRequest = () => dispatch(usersActions.usersDeleteAvatarRequest())

  return {
    navigation,
    handleLibrarySnap,
    handleCameraSnap,
    handleSkipUpload,
    usersDeleteAvatarRequest,
    isAvatarEmpty,
    navigateProfilePhotoGrid,
  }
}

export default useProfilePhoto
