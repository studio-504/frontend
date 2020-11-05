import { useEffect, useCallback, useContext } from 'react'
import * as signupActions from 'store/ducks/signup/actions'
import * as navigationActions from 'navigation/actions'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigation } from '@react-navigation/native'
import { ThemeContext } from 'services/providers/Theme'
import * as signupSelectors from 'store/ducks/signup/selectors'
import { pageHeaderLeft } from 'navigation/options'
import * as Validation from 'services/Validation'

const AuthPhoneComponentService = ({ children }) => {
  const dispatch = useDispatch()
  const navigation = useNavigation()
  const { theme } = useContext(ThemeContext)
  const signupCreate = useSelector(signupSelectors.signupCreate)

  /**
   * Navigation state reset on back button press
   */
  const handleGoBack = useCallback(() => {
    dispatch(signupActions.signupCreateIdle({}))
    navigationActions.navigateAuthPassword(navigation)
  }, [])

  useEffect(() => {
    const tabNavigator = navigation.dangerouslyGetParent()
    if (!tabNavigator) return
    tabNavigator.setOptions({
      headerLeft: (props) => pageHeaderLeft({ ...props, onPress: handleGoBack, theme }),
    })
  }, [])

  const handleFormTransform = (values) => ({
    countryCode: Validation.getCountryCode(values),
    phone: Validation.getPhone(values),
  })

  const handleFormSubmit = (values) => {
    const nextValues = handleFormTransform(values)

    dispatch(signupActions.signupCreateRequest({
      usernameType: 'phone',
      countryCode: nextValues.countryCode,
      phone: nextValues.phone,
    }))
  }

  const formSubmitLoading = signupCreate.status === 'loading'
  const formSubmitDisabled = signupCreate.status === 'loading'
  const formErrorMessage = signupCreate.error.text
  const formInitialValues = handleFormTransform(signupCreate.payload)

  const handleErrorClose = () => dispatch(signupActions.signupCreateIdle({}))

  return children({
    formErrorMessage,
    handleFormSubmit,
    handleErrorClose,
    formSubmitLoading,
    formSubmitDisabled,
    formInitialValues,
  })
}

export default AuthPhoneComponentService
