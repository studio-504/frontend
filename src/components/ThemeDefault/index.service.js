import { useDispatch } from 'react-redux'
import { useNavigation } from '@react-navigation/native'
import * as themesActions from 'store/ducks/themes/actions'

const ThemeDefaultService = ({ children }) => {
  const dispatch = useDispatch()
  const navigation = useNavigation()

  const handleClose = () => navigation.popToTop()
  const handleEditThemeCode = ({ themeCode }) => dispatch(themesActions.themesEditRequest({ themeCode }))

  const handleSkip = () => {
    handleEditThemeCode({ themeCode: 'white.green' })
    handleClose()
  }

  const handleEnable = () => {
    handleEditThemeCode({ themeCode: 'black.green' })
    handleClose()
  }

  return children({
    handleSkip,
    handleEnable,
  })
}

export default ThemeDefaultService
