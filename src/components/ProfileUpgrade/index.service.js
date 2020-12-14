import { useNavigation } from '@react-navigation/native'

const ProfileUpgradeService = ({ children }) => {
  const navigation = useNavigation()
  const handleClose = () => navigation.popToTop()

  return children({
    handleClose,
  })
}

export default ProfileUpgradeService
