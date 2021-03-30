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
export const authForgotConfirm = compose(prop('authForgotConfirm'), authRoot)
export const authSigninCognito = compose(prop('authSigninCognito'), authRoot)
export const authSigninGoogle = compose(prop('authSigninGoogle'), authRoot)
export const authSigninApple = compose(prop('authSigninApple'), authRoot)
export const authSigninAnonymous = compose(prop('authSigninAnonymous'), authRoot)
export const authFlow = compose(prop('authFlow'), authRoot)

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
