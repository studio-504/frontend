import { useEffect, useCallback, useContext } from 'react'
import * as authActions from 'store/ducks/auth/actions'
import * as signupActions from 'store/ducks/signup/actions'
import * as navigationActions from 'navigation/actions'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigation } from '@react-navigation/native'
import { ThemeContext } from 'services/providers/Theme'
import { pageHeaderLeft } from 'navigation/options'
import * as authSelectors from 'store/ducks/auth/selectors'
import * as Validation from 'services/Validation'

const AuthForgotConfirmComponentService = ({ children }) => {
  const dispatch = useDispatch()
  const navigation = useNavigation()
  const { theme } = useContext(ThemeContext)

  const authForgot = useSelector(authSelectors.authForgot)
  const authForgotConfirm = useSelector(state => state.auth.authForgotConfirm)

  const handleFormTransform = (values) => ({
    username: Validation.getUsername(values),
    confirmationCode: Validation.getConfirmationCode(values),
    password: Validation.getPassword(values),
  })

  const handleFormSubmit = (values, formApi) => {
    const nextValues = handleFormTransform(values)
    formApi.setValues(nextValues)
    
    dispatch(authActions.authForgotConfirmRequest(nextValues))
  }

  /**
   * Navigation state reset on back button press
   */
  const handleGoBack = useCallback(() => {
    dispatch(signupActions.authForgotConfirmIdle({}))
    navigationActions.navigateAuthForgotPhone(navigation)
  }, [])

  useEffect(() => {
    const tabNavigator = navigation.dangerouslyGetParent()
    if (!tabNavigator) return
    tabNavigator.setOptions({
      headerLeft: (props) => pageHeaderLeft({ ...props, onPress: handleGoBack, theme }),
    })
  }, [])

  const formSubmitLoading = authForgotConfirm.status === 'loading'
  const formSubmitDisabled = authForgotConfirm.status === 'loading'
  const formErrorMessage = authForgotConfirm.error.text
  const formInitialValues = handleFormTransform(authForgot.payload)

  const handleErrorClose = () => dispatch(authActions.authForgotConfirmIdle())

  return children({
    formErrorMessage,
    handleFormSubmit,
    handleErrorClose,
    formSubmitLoading,
    formSubmitDisabled,
    formInitialValues,
  })
}

export default AuthForgotConfirmComponentService
