import { useEffect, useCallback, useContext } from 'react'
import * as signupActions from 'store/ducks/signup/actions'
import * as navigationActions from 'navigation/actions'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigation } from '@react-navigation/native'
import { ThemeContext } from 'services/providers/Theme'
import * as Validation from 'services/Validation'
import { pageHeaderLeft } from 'navigation/options'
import testIDs from './test-ids'

const AuthUsernameComponentService = ({ children }) => {
  const dispatch = useDispatch()
  const navigation = useNavigation()
  const { theme } = useContext(ThemeContext)

  const signupUsername = useSelector(state => state.signup.signupUsername)

  const handleFormTransform = (values) => ({
    username: Validation.getUsername(values),
  })

  const handleFormSubmit = (values, formApi) => {
    const nextValues = handleFormTransform(values)
    formApi.setValues(nextValues)

    dispatch(signupActions.signupUsernameRequest(nextValues))
  }

  /**
   * Navigation state reset on back button press
   */
  const handleGoBack = useCallback(() => {
    navigationActions.navigateAuthHome(navigation)
  }, [])

  useEffect(() => {
    navigation.setOptions({
      headerLeft: () => pageHeaderLeft({ 
        testID: testIDs.header.backBtn, 
        onPress: handleGoBack, 
        theme,
      }),
    })
  }, [])

  const formSubmitLoading = signupUsername.status === 'loading'
  const formSubmitDisabled = signupUsername.status === 'loading'
  const formErrorMessage = signupUsername.error.text
  const formInitialValues = handleFormTransform(signupUsername.payload)

  const handleErrorClose = () => dispatch(signupActions.signupUsernameIdle())

  return children({
    formErrorMessage,
    handleFormSubmit,
    handleFormTransform,
    handleErrorClose,
    formSubmitLoading,
    formSubmitDisabled,
    formInitialValues,
  })
}

export default AuthUsernameComponentService
