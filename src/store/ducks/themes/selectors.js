import { createSelector } from 'reselect'
import pathOr from 'ramda/src/pathOr'
import themesJson from 'assets/themes.json'
import * as authSelector from 'store/ducks/auth/selectors'
import * as constants from 'store/ducks/themes/constants'

export const themeSelector = createSelector(authSelector.authUserSelector, (authUser) => {
  const activeTheme = pathOr(constants.DEFAULT_THEME, ['themeCode'])(authUser)
  return (themesJson.find((theme) => theme.key === activeTheme) || {}).theme
})
