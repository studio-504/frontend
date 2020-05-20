import { useEffect } from 'react'
import * as signupActions from 'store/ducks/signup/actions'
import * as navigationActions from 'navigation/actions'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigation } from '@react-navigation/native'
import { logEvent } from 'services/Analytics'

const AuthPasswordComponentService = ({ children }) => {
  const dispatch = useDispatch()
  const navigation = useNavigation()

  const signupPassword = useSelector(state => state.signup.signupPassword)

  const handleFormSubmit = (payload) => {
    logEvent('SIGNUP_PASSWORD_REQUEST')
    dispatch(signupActions.signupPasswordRequest(payload))
  }

  /**
   * Redirect to verification confirmation once signup was successful
   */
  useEffect(() => {
    if (
      signupPassword.status !== 'success'
    ) return

    logEvent('SIGNUP_PASSWORD_SUCCESS')
    navigationActions.navigateSignup(navigation)()
  }, [
    signupPassword.status,
    signupPassword.payload.password,
  ])

  const formSubmitLoading = signupPassword.status === 'loading'
  const formSubmitDisabled = signupPassword.status === 'loading'
  const formErrorMessage = signupPassword.error.text

  const formInitialValues = {
    password: signupPassword.payload.password,
  }

  const handleFormTransform = (values) => values

  const handleErrorClose = () => dispatch(signupActions.signupPasswordIdle())

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

export default AuthPasswordComponentService