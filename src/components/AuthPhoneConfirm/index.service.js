import * as signupActions from 'store/ducks/signup/actions'
import { useDispatch, useSelector } from 'react-redux'
import { useRoute } from '@react-navigation/native'
import path from 'ramda/src/path'
import * as Validation from 'services/Validation'
import * as signupSelectors from 'store/ducks/signup/selectors'

const AuthPhoneConfirmComponentService = ({ children }) => {
  const dispatch = useDispatch()
  const route = useRoute()

  const signupConfirm = useSelector(signupSelectors.signupConfirm)
  const signupCreate = useSelector(signupSelectors.signupCreate)

  const handleFormTransform = (values) => ({
    confirmationCode: Validation.getConfirmationCode(values),
  })

  const handleFormSubmit = (values, formApi) => {
    const nextValues = handleFormTransform(values)
    formApi.setValues(nextValues)

    dispatch(signupActions.signupConfirmRequest({
      usernameType: 'phone',
      confirmationCode: nextValues.confirmationCode,
    }))
  }

  const formSubmitLoading = signupConfirm.status === 'loading'
  const formSubmitDisabled = signupConfirm.status === 'loading'

  const formInitialValues = {
    cognitoUsername: path(['payload', 'phone'])(signupCreate),
    confirmationCode: path(['params', 'confirmationCode'])(route),
  }

  return children({
    handleFormSubmit,
    formSubmitLoading,
    formSubmitDisabled,
    formInitialValues,
  })
}

export default AuthPhoneConfirmComponentService
