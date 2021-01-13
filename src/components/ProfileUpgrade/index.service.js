import { useNavigation } from '@react-navigation/native'
import * as navigationActions from 'navigation/actions'

const ProfileUpgradeService = ({ children }) => {
  const navigation = useNavigation()
  const handleClose = () => navigation.popToTop()
  const navigateSignin = () => navigationActions.navigateSignin(navigation)

  return children({
    handleClose,
    navigateSignin,
  })
}


export default ProfileUpgradeService
