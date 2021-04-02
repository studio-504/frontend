import { createSelector } from 'reselect'
import pathOr from 'ramda/src/pathOr'
import path from 'ramda/src/path'
import prop from 'ramda/src/prop'
import compose from 'ramda/src/compose'
import is from 'ramda/src/is'
import * as normalizer from 'normalizer/schemas'
import { entitiesSelector } from 'store/ducks/entities/selectors'

const authRoot = prop('auth')
const authUser = () => path(['auth', 'user'])
export const authForgot = compose(prop('authForgot'), authRoot)
export const authSigninCognito = compose(prop('authSigninCognito'), authRoot)

export const authUserSelector = createSelector(
  [authUser(), entitiesSelector],
  (authUser, entities) => {
    return normalizer.denormalizeUserGet(authUser, entities)
  },
)

export const authUserIdSelector = createSelector(
  [authUser()],
  (authUser) => {
    return is(String, authUser) && authUser
  },
)

export const languageCodeSelector =
  state => pathOr('', ['auth', 'user', 'languageCode'], state)
