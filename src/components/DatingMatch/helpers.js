import dayjs from 'dayjs'
import pathOr from 'ramda/src/pathOr'
import propOr from 'ramda/src/propOr'
import path from 'ramda/src/path'
import * as Validation from 'services/Validation'

const lowerBoundAge = (age) => {
  if (age <= 23 || !age) return 18
  return age - 5
}

const upperBoundAge = (age) => {
  if (age <= 23 || !age) return 23
  return age + 5
}

export const getMatchAgeRangeMin = (user) => {
  const usersAge = dayjs().diff(user.dateOfBirth, 'year')
  return pathOr(lowerBoundAge(usersAge), ['matchAgeRange', 'min'], user)
}

export const getMatchAgeRangeMax = (user) => {
  const usersAge = dayjs().diff(user.dateOfBirth, 'year')
  return pathOr(upperBoundAge(usersAge), ['matchAgeRange', 'max'], user)
}

export const getMatchHeightRangeMin = pathOr(Validation.MIN_HEIGHT, ['matchHeightRange', 'min'])
export const getMatchHeightRangeMax = pathOr(Validation.MAX_HEIGHT, ['matchHeightRange', 'max'])

export const getMatchGenders = (user) => {
  const gender = path(['gender'], user)
  const matchGenders = path(['matchGenders', 0], user)

  if (matchGenders) {
    return matchGenders
  } else if (gender) {
    return gender === 'MALE' ? 'FEMALE' : 'MALE'
  } else {
    return undefined
  }
}

export const getMatchLocationRadius = pathOr(50, ['matchLocationRadius'])

export const getDateOfBirth = (user) => {
  const dateOfBirthParsed = dayjs(propOr('2000-01-01', 'dateOfBirth', user), 'YYYY-MM-DD')

  return {
    dateOfBirthYear: dateOfBirthParsed.format('YYYY'),
    dateOfBirthMonth: dateOfBirthParsed.format('MM'),
    dateOfBirthDay: dateOfBirthParsed.format('DD'),
  }
}

export const makeDateOfBirth = (values) => {
  return [values.dateOfBirthYear, values.dateOfBirthMonth, values.dateOfBirthDay].join('-')
}
