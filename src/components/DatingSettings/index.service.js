import { useEffect, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import * as usersActions from 'store/ducks/users/actions'
import { useNavigation } from '@react-navigation/native'
import * as authSelector from 'store/ducks/auth/selectors'
import * as usersSelector from 'store/ducks/users/selectors'
import * as helpers from 'components/DatingMatch/helpers'
import propEq from 'ramda/src/propEq'
import path from 'ramda/src/path'

const getDisableDatingByStatus = propEq('datingStatus', 'DISABLED')
const getErrorText = path(['error', 'text'])

const DatingSettingsService = ({ children }) => {
  const dispatch = useDispatch()
  const navigation = useNavigation()
  const user = useSelector(authSelector.authUserSelector)
  const usersEditProfile = useSelector(usersSelector.usersEditProfile)
  const usersSetUserDatingStatus = useSelector(usersSelector.usersSetUserDatingStatus)
  const [disableDating, setDisableDating] = useState(getDisableDatingByStatus(user))

  const usersEditProfileIdle = () => dispatch(usersActions.usersEditProfileIdle())
  const usersSetUserDatingStatusIdle = () => dispatch(usersActions.usersSetUserDatingStatusIdle())
  const handleErrorClose = () => {
    usersEditProfileIdle()
    usersSetUserDatingStatusIdle()
  }

  useEffect(() => {
    if (usersEditProfile.status === 'success') {
      handleErrorClose()
      navigation.goBack()
    }
  }, [usersEditProfile.status])

  useEffect(() => {
    if (usersSetUserDatingStatus.status === 'failure') {
      setDisableDating(getDisableDatingByStatus(user))
    }
  }, [usersSetUserDatingStatus.status])

  useEffect(() => handleErrorClose, [])

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

  const toggleDatingStatusRequest = () => {
    const status = disableDating ? 'ENABLED' : 'DISABLED'
    dispatch(usersActions.usersSetUserDatingStatusRequest({ status }))
    setDisableDating(!disableDating)
  }

  const formSubmitLoading = usersEditProfile.status === 'loading'
  const formErrorMessage = getErrorText(usersEditProfile) || getErrorText(usersSetUserDatingStatus)

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
    disableDating,
    toggleDatingStatusRequest,
  })
}

export default DatingSettingsService
