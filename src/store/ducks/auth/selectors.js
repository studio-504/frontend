import { createSelector } from 'reselect'
import pathOr from 'ramda/src/pathOr'
import path from 'ramda/src/path'
import prop from 'ramda/src/prop'
import compose from 'ramda/src/compose'
import is from 'ramda/src/is'
import * as normalizer from 'normalizer/schemas'
import * as entitiesSelector from 'store/ducks/entities/selectors'
import * as usersSelector from 'store/ducks/users/selectors'

const authRoot = prop('auth')
const authUser = () => path(['auth', 'user'])
const authData = () => path(['auth', 'authData'])
export const authForgot = compose(prop('authForgot'), authRoot)
export const authSigninCognito = compose(prop('authSigninCognito'), authRoot)

export const authUserSelector = createSelector(
  [authUser(), authData(), usersSelector.usersEditProfile, usersSelector.usersGetProfileSelf, usersSelector.usersDeleteAvatar, usersSelector.usersChangeAvatar, usersSelector.usersSetUserDatingStatus, entitiesSelector.entities],
  (authUser, authData, usersEditProfile, usersGetProfileSelf, usersDeleteAvatar, usersChangeAvatar, usersSetUserDatingStatus, entities) => {
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
