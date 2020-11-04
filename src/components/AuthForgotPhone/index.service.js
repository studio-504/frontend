import { useEffect, useCallback, useContext } from 'react'
import * as authActions from 'store/ducks/auth/actions'
import * as navigationActions from 'navigation/actions'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigation } from '@react-navigation/native'
import { ThemeContext } from 'services/providers/Theme'
import { pageHeaderLeft } from 'navigation/options'
import * as authSelectors from 'store/ducks/auth/selectors'
import * as Validation from 'services/Validation'

const AuthForgotComponentService = ({ children }) => {
  const dispatch = useDispatch()
  const navigation = useNavigation()
  const { theme } = useContext(ThemeContext)

  const authForgot = useSelector(authSelectors.authForgot)

  const handleFormTransform = (values) => ({
    countryCode: Validation.getCountryCode(values),
    phone: Validation.getPhone(values),
  })

  const handleFormSubmit = (values, formApi) => {
    const nextValues = handleFormTransform(values)
    formApi.setValues(nextValues)

    dispatch(authActions.authForgotRequest({
      usernameType: 'phone',
      countryCode: nextValues.countryCode,
      phone: nextValues.phone,
    }))
  }

  /**
   * Navigation state reset on back button press
   */
  const handleGoBack = useCallback(() => {
    dispatch(authActions.authForgotIdle({}))
    navigationActions.navigateAuthHome(navigation)
  }, [])

  useEffect(() => {
    const tabNavigator = navigation.dangerouslyGetParent()
    if (!tabNavigator) return
    tabNavigator.setOptions({
      headerLeft: (props) => pageHeaderLeft({ ...props, onPress: handleGoBack, theme }),
    })
  }, [])

  const formSubmitLoading = authForgot.status === 'loading'
  const formSubmitDisabled = authForgot.status === 'loading'
  const formErrorMessage = authForgot.error.text
  const formInitialValues = handleFormTransform(authForgot.payload)

  const handleErrorClose = () => dispatch(authActions.authForgotIdle({}))

  return children({
    formErrorMessage,
    handleFormSubmit,
    handleErrorClose,
    formSubmitLoading,
    formSubmitDisabled,
    formInitialValues,
  })
}

export default AuthForgotComponentService
