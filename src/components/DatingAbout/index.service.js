import { useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import * as usersActions from 'store/ducks/users/actions'
import * as authSelector from 'store/ducks/auth/selectors'
import * as navigationActions from 'navigation/actions'
import { useNavigation } from '@react-navigation/native'
import * as helpers from 'components/DatingMatch/helpers'

const DatingAboutService = ({ children }) => {
  const dispatch = useDispatch()
  const navigation = useNavigation()
  const user = useSelector(authSelector.authUserSelector)
  const usersEditProfile = useSelector(state => state.users.usersEditProfile)
  const dateOfBirthParsed = helpers.getDateOfBirth(user)
  
  useEffect(() => {
    if (usersEditProfile.status === 'success') {
      dispatch(usersActions.usersEditProfileIdle())
      navigationActions.navigateDatingMatch(navigation)()
    }
  }, [usersEditProfile.status])

  /**
   * Form helpers
   */
  const handleFormTransform = (values) => ({
    dateOfBirth: helpers.makeDateOfBirth(values),
    gender: values.gender,
    fullName: values.fullName,
    bio: values.bio,
    height: values.height,
  })

  const handleFormSubmit = (values) => {
    dispatch(usersActions.usersEditProfileRequest(handleFormTransform(values)))
  }

  const formSubmitLoading = usersEditProfile.status === 'loading'
  const formErrorMessage = usersEditProfile.error.text

  const formInitialValues = {
    dateOfBirthYear: dateOfBirthParsed.dateOfBirthYear, 
    dateOfBirthMonth: dateOfBirthParsed.dateOfBirthMonth, 
    dateOfBirthDay: dateOfBirthParsed.dateOfBirthDay, 
    gender: user.gender,
    fullName: user.fullName,
    bio: user.bio,
    height: user.height,
  }

  const handleErrorClose = () => dispatch(usersActions.usersEditProfileIdle())

  return children({
    handleFormSubmit,
    formInitialValues,
    formSubmitLoading,
    formErrorMessage,
    handleErrorClose,
  })
}

export default DatingAboutService
