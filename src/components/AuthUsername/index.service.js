import { useEffect } from 'react'
import * as signupActions from 'store/ducks/signup/actions'
import { useDispatch, useSelector } from 'react-redux'
import * as Validation from 'services/Validation'

const AuthUsernameComponentService = ({ children }) => {
  const dispatch = useDispatch()

  const signupUsername = useSelector(state => state.signup.signupUsername)

  const handleFormTransform = (values) => ({
    username: Validation.getUsername(values),
  })

  const handleFormSubmit = (values, formApi) => {
    const nextValues = handleFormTransform(values)
    formApi.setValues(nextValues)

    dispatch(signupActions.signupUsernameRequest(nextValues))
  }

  useEffect(() => {
    dispatch(signupActions.signupUsernameIdle())
  }, [])

  const formSubmitLoading = signupUsername.status === 'loading'
  const formSubmitDisabled = signupUsername.status === 'loading'
  const formInitialValues = handleFormTransform(signupUsername.payload)

  return children({
    handleFormSubmit,
    formSubmitLoading,
    formSubmitDisabled,
    formInitialValues,
  })
}

export default AuthUsernameComponentService
