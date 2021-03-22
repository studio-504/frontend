import { useDispatch } from 'react-redux'
import { useNavigation } from '@react-navigation/native'
import * as themesActions from 'store/ducks/themes/actions'
import * as themeSelector from 'store/ducks/themes/selectors'

const ThemeDefaultService = ({ children }) => {
  const dispatch = useDispatch()
  const navigation = useNavigation()
  const theme = themeSelector.getTheme('black.green')

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
    theme,
    handleSkip,
    handleEnable,
  })
}

export default ThemeDefaultService
