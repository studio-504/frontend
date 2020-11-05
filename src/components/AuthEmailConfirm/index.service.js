import { useEffect, useCallback, useContext } from 'react'
import * as signupActions from 'store/ducks/signup/actions'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigation, useRoute } from '@react-navigation/native'
import { ThemeContext } from 'services/providers/Theme'
import path from 'ramda/src/path'
import { pageHeaderLeft } from 'navigation/options'
import testIDs from './test-ids'
import * as signupSelectors from 'store/ducks/signup/selectors'

const AuthEmailConfirmComponentService = ({ children }) => {
  const dispatch = useDispatch()
  const navigation = useNavigation()
  const route = useRoute()
  const { theme } = useContext(ThemeContext)

  const signupConfirm = useSelector(state => state.signup.signupConfirm)
  const signupCreate = useSelector(signupSelectors.signupCreate)

  /**
   * Navigation state reset on back button press
   */
  const handleGoBack = useCallback(() => {
    dispatch(signupActions.signupConfirmIdle({}))
    navigation.goBack()
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

  const handleFormTransform = (values) => ({
    confirmationCode: values.confirmationCode,
  })

  const handleFormSubmit = (values) => {
    const nextValues = handleFormTransform(values)

    dispatch(signupActions.signupConfirmRequest({
      confirmationCode: nextValues.confirmationCode,
    }))
  }

  const formSubmitLoading = signupConfirm.status === 'loading'
  const formSubmitDisabled = signupConfirm.status === 'loading'
  const formErrorMessage = signupConfirm.error.text

  const formInitialValues = {
    cognitoUsername: path(['payload', 'email'])(signupCreate),
    confirmationCode: path(['params', 'confirmationCode'])(route),
  }

  const handleErrorClose = () => dispatch(signupActions.signupConfirmIdle({}))

  return children({
    formErrorMessage,
    handleFormSubmit,
    handleErrorClose,
    formSubmitLoading,
    formSubmitDisabled,
    formInitialValues,
  })
}

export default AuthEmailConfirmComponentService
