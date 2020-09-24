import pathOr from 'ramda/src/pathOr'

export const appTranslationSelector =
  state => pathOr({}, ['app', 'appTranslation', 'data'], state)
