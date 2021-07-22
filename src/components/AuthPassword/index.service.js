import { useContext, useEffect } from 'react'
import * as signupActions from 'store/ducks/signup/actions'
import { useDispatch, useSelector } from 'react-redux'
import * as Validation from 'services/Validation'
import * as signupSelectors from 'store/ducks/signup/selectors'
import { useNavigation } from '@react-navigation/core'
import { ThemeContext } from 'services/providers/Theme'
import * as navigationOptions from 'navigation/options'
import testIDs from './test-ids'

const AuthPasswordComponentService = ({ children }) => {
  const dispatch = useDispatch()
  const signupPassword = useSelector(signupSelectors.signupPassword)
  const navigation = useNavigation()
  const { theme } = useContext(ThemeContext)

  useEffect(() => {
    navigation.setOptions({
      headerLeft: (props) => navigationOptions.pageHeaderLeft({
        ...props,
        theme,
        onPress: () => navigation.goBack(),
        testID: testIDs.header.backBtn,
      }),
    })
    dispatch(signupActions.signupPasswordIdle())
  }, [])

  const handleFormTransform = (values) => ({
    password: Validation.getPassword(values),
  })

  const handleFormSubmit = (values) => {
    const nextValues = handleFormTransform(values)

    dispatch(signupActions.signupPasswordRequest(nextValues))
  }

  const formSubmitLoading = signupPassword.status === 'loading'
  const formSubmitDisabled = signupPassword.status === 'loading'
  const formInitialValues = {}

  return children({
    handleFormSubmit,
    handleFormTransform,
    formSubmitLoading,
    formSubmitDisabled,
    formInitialValues,
  })
}

export default AuthPasswordComponentService
