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

export const username = Yup.string()
  .min(3)
  .max(50)
  .matches(/^[a-zA-Z0-9_.]*$/, 'username must only contain letters & numbers')
  .trim()
  .required()
  .test('usernameReserve', 'username is reserved', remoteUsernameValidation())

export const email = Yup.string()
  .matches(/^\S*$/, 'no whitespace')
  .email()
  .min(3)
  .max(50)
  .trim()
  .required()

export const phone = Yup.string()
  .matches(/^[0-9]*$/gm, 'numbers only')
  .min(3)
  .max(50)
  .trim()
  .required()

export const password = Yup.string()
  .min(8)
  .max(50)
  .trim()
  .required()

const onlyNumbers = replace(/[^+0-9]/g, '')
export const getPhone = compose(onlyNumbers, trim, toLower, pathOr('', ['phone']))
export const getCountryCode = compose(onlyNumbers, trim, toLower, pathOr('+1', ['countryCode']))
export const getEmail = compose(trim, toLower, pathOr('', ['email']))
export const getUsername = compose(trim, toLower, pathOr('', ['username']))
export const getPassword = compose(trim, pathOr('', ['password']))