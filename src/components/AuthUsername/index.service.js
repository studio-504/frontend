import { useEffect } from 'react'
import path from 'ramda/src/path'
import * as signupActions from 'store/ducks/signup/actions'
import { useRoute } from '@react-navigation/native'
import { useDispatch, useSelector } from 'react-redux'
import * as Validation from 'services/Validation'

const AuthUsernameComponentService = ({ children }) => {
  const dispatch = useDispatch()
  const route = useRoute()
  const signupUsername = useSelector(state => state.signup.signupUsername)

  const handleFormTransform = (values) => ({
    username: Validation.getUsername(values),
  })

  const handleFormSubmit = (values, formApi) => {
    const nextValues = handleFormTransform(values)
    formApi.setValues(nextValues)

    dispatch(signupActions.signupUsernameRequest({
      username: path(['username'], nextValues),
      nextRoute: path(['params', 'nextRoute'], route),
    }))
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
