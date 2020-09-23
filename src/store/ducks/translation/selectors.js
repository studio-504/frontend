import pathOr from 'ramda/src/pathOr'

export const translationFetchSelector =
  state => pathOr({}, ['translation', 'translationFetch', 'data'], state)
