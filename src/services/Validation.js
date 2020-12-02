import * as Yup from 'yup'
import path from 'ramda/src/path'
import trim from 'ramda/src/trim'
import compose from 'ramda/src/compose'
import replace from 'ramda/src/replace'
import toLower from 'ramda/src/toLower'
import pathOr from 'ramda/src/pathOr'
import debounce from 'debounce-async'
import API, { graphqlOperation } from '@aws-amplify/api'
import * as usersQueries from 'store/ducks/users/queries'

/**
 * Constants
 */
const ERRORS = {
  dateOfBirthMonth: 'Month must be selected',
  dateOfBirthDay: 'Date must be selected',
  dateOfBirthYear: 'Year must be selected',
  gender: 'Gender must be selected',
  fullName: 'Name must be entered',
  bio: 'Bio must be filled',
  matchAgeRangeMin: 'Minimum age must be a selected',
  matchAgeRangeMax: 'Maximum age must be a selected',
  matchLocationRadius: 'Radius must be a selected',
  matchGendersError: 'Gender must be a selected',
  onlyNumbers: 'must only contain numbers',
  noWhitespace: 'no whitespace',
  height: 'Height must be selected',
}

export const MIN_HEIGHT = 2.54
export const MAX_HEIGHT = 297.18

/**
 * Validators
 */
export async function usernameStatusRequest(username) {
  const response = await API.graphql(graphqlOperation(usersQueries.usernameStatus, { username }))
  return path(['data', 'usernameStatus'], response)
}

export const remoteUsernameValidation = () => {
  function validate(value) {
    return new Promise((resolve) => {
      usernameStatusRequest(value)
        .then((usernameStatus) => resolve(usernameStatus === 'AVAILABLE'))
        .catch(() => resolve(true))
    })
  }

  const debouncedValidation = debounce(validate, 300, { leading: true })
  const ignoreError = () => {}

  return function (value) {
    return debouncedValidation(value).catch(ignoreError)
  }
}

export const phoneOrEmail = Yup.string()
  .min(3)
  .max(50)
  .trim()
  .required()

export const username = Yup.string()
  .min(3)
  .max(50)
  .matches(/^[a-zA-Z0-9_.]*$/, 'username must only contain letters & numbers')
  .trim()
  .required()
  .test('usernameReserve', 'username is reserved', remoteUsernameValidation())

export const email = Yup.string()
  .matches(/^\S*$/, ERRORS.noWhitespace)
  .email()
  .min(3)
  .max(50)
  .trim()
  .required()

export const phone = Yup.string()
  .matches(/^[0-9]*$/gm, ERRORS.onlyNumbers)
  .min(3)
  .max(50)
  .trim()
  .required()

export const password = Yup.string()
  .min(8)
  .max(50)
  .trim()
  .required()

export const confirmationCode = Yup.string()
  .length(6)
  .matches(/^[0-9]*$/, ERRORS.onlyNumbers)
  .matches(/^\S*$/, ERRORS.noWhitespace)
  .trim()
  .required()

export const dateOfBirthMonth = Yup.number()
  .typeError(ERRORS.dateOfBirthMonth)
  .positive(ERRORS.dateOfBirthMonth)
  .required(ERRORS.dateOfBirthMonth)

export const dateOfBirthDay = Yup.number()
  .typeError(ERRORS.dateOfBirthDay)
  .positive(ERRORS.dateOfBirthDay)
  .required(ERRORS.dateOfBirthDay)

export const dateOfBirthYear = Yup.number()
  .typeError(ERRORS.dateOfBirthYear)
  .positive(ERRORS.dateOfBirthYear)
  .required(ERRORS.dateOfBirthYear)

export const gender = Yup.string()
  .typeError(ERRORS.gender)
  .required(ERRORS.gender)

export const fullName = Yup.string()
  .typeError(ERRORS.fullName)
  .required(ERRORS.fullName)

export const bio = Yup.string()
  .typeError(ERRORS.bio)
  .required(ERRORS.bio)

export const matchAgeRangeMin = Yup.number()
  .typeError(ERRORS.matchAgeRangeMin)
  .positive(ERRORS.matchAgeRangeMin)
  .required(ERRORS.matchAgeRangeMin)

export const matchAgeRangeMax = Yup.number()
  .typeError(ERRORS.matchAgeRangeMax)
  .positive(ERRORS.matchAgeRangeMax)
  .required(ERRORS.matchAgeRangeMax)

export const matchLocationRadius = Yup.number()
  .typeError(ERRORS.matchLocationRadius)
  .positive(ERRORS.matchLocationRadius)
  .required(ERRORS.matchLocationRadius)

export const matchGenders = Yup.string()
  .typeError(ERRORS.matchGendersError)
  .required(ERRORS.matchGendersError)

export const height = Yup.number()
  .min(MIN_HEIGHT)
  .max(MAX_HEIGHT)
  .required(ERRORS.height)

/**
 * Selectors
 */
const onlyNumbers = replace(/[^+0-9]/g, '')
export const getPhone = compose(onlyNumbers, trim, toLower, pathOr('', ['phone']))
export const getCountryCode = compose(onlyNumbers, trim, toLower, pathOr('+1', ['countryCode']))
export const getEmail = compose(trim, toLower, pathOr('', ['email']))
export const getUsername = compose(trim, toLower, pathOr('', ['username']))
export const getPassword = compose(trim, pathOr('', ['password']))
export const getConfirmationCode = compose(onlyNumbers, trim, toLower, pathOr('', ['confirmationCode']))

/**
 * Input Props
 */
export const getInputTypeProps = (type) => {
  switch (type) {
    case 'email':
      return {
        accessibilityLabel: 'email',
        keyboardType: 'email-address',
        textContentType: 'emailAddress',
        autoCompleteType: 'email',
      }
    case 'confirmationCode':
      return {
        accessibilityLabel: 'confirmationCode',
        keyboardType: 'number-pad',
        textContentType: 'oneTimeCode',
        autoCompleteType: 'off',
        maxLength: 6,
      }
    case 'password':
      return {
        accessibilityLabel: 'password',
        secureTextEntry: true,
        keyboardType: 'default',
        textContentType: 'password',
        autoCompleteType: 'password',
      }
    case 'username':
      return {
        accessibilityLabel: 'username',
        keyboardType: 'default',
        textContentType: 'username',
        autoCompleteType: 'username',
      }
    case 'phone':
      return {
        accessibilityLabel: 'phone',
        keyboardType: 'number-pad',
        textContentType: 'telephoneNumber',
        autoCompleteType: 'tel',
      }
    default:
      return {}
  }
}
