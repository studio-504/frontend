import { useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import * as usersActions from 'store/ducks/users/actions'
import { useNavigation } from '@react-navigation/native'
import * as authSelector from 'store/ducks/auth/selectors'
import * as helpers from 'components/DatingMatch/helpers'

const DatingSettingsService = ({ children }) => {
  const dispatch = useDispatch()
  const navigation = useNavigation()
  const user = useSelector(authSelector.authUserSelector)
  const usersEditProfile = useSelector((state) => state.users.usersEditProfile)

  const usersEditProfileIdle = () => dispatch(usersActions.usersEditProfileIdle())
  const handleErrorClose = usersEditProfileIdle

  useEffect(() => {
    if (usersEditProfile.status === 'success') {
      usersEditProfileIdle()
      navigation.goBack()
    }
  }, [usersEditProfile.status])

  const handleFormTransform = (values) => ({
    dateOfBirth: helpers.makeDateOfBirth(values),
    gender: values.gender,
    fullName: values.fullName,
    bio: values.bio,
    matchAgeRange: {
      min: values.matchAgeRangeMin,
      max: values.matchAgeRangeMax,
    },
    matchGenders: values.matchGenders,
    matchLocationRadius: values.matchLocationRadius,
    location: values.location,
    disableDating: values.disableDating,
  })

  const handleFormSubmit = (values) => {
    dispatch(usersActions.usersEditProfileRequest(handleFormTransform(values)))
  }

  const formSubmitLoading = usersEditProfile.status === 'loading'
  const formErrorMessage = usersEditProfile.error.text

  const dateOfBirthParsed = helpers.getDateOfBirth(user)
  const formInitialValues = {
    dateOfBirthYear: dateOfBirthParsed.dateOfBirthYear,
    dateOfBirthMonth: dateOfBirthParsed.dateOfBirthMonth,
    dateOfBirthDay: dateOfBirthParsed.dateOfBirthDay,
    gender: user.gender,
    fullName: user.fullName,
    bio: user.bio,
    matchAgeRangeMin: helpers.getMatchAgeRangeMin(user),
    matchAgeRangeMax: helpers.getMatchAgeRangeMax(user),
    matchGenders: helpers.getMatchGenders(user),
    matchLocationRadius: helpers.getMatchLocationRadius(user),
    location: user.location,
    disableDating: user.disableDating,
  }

  return children({
    handleFormSubmit,
    formInitialValues,
    formSubmitLoading,
    formErrorMessage,
    handleErrorClose,
  })
}

export default DatingSettingsService
