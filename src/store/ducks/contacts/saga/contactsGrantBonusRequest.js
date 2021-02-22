import { put, call, select, takeEvery } from 'redux-saga/effects'
import * as usersActions from 'store/ducks/users/actions'
import * as constants from 'store/ducks/contacts/constants'
import * as selectors from 'store/ducks/contacts/selectors'
import * as actions from 'store/ducks/contacts/actions'
import * as queries from 'store/ducks/contacts/queries'
import * as queryService from 'services/Query'
import * as navigationActions from 'navigation/actions'
import * as NavigationService from 'services/Navigation'
import * as UserService from 'services/User'
import * as authSelector from 'store/ducks/auth/selectors'

function* contactsCheckBonusRequest() {
  try {
    const user = yield select(authSelector.authUserSelector)
    const { invited } = yield select(selectors.contactsInvite)

    if (!UserService.isUserAuthorized(user)) return
    if (UserService.isUserSubscribed(user)) return

    if (Object.keys(invited).length === constants.CONTACTS_INVITE_LIMIT) {
      yield put(actions.contactsGrantBonusRequest({ grantCode: 'FREE_FOR_LIFE' }))
    }
  } catch (error) {
    yield put(actions.contactsCheckBonusFailure(error))
  }
}

function* contactsGrantBonusRequest(req) {
  try {
    yield call(queryService.apiRequest, queries.grantUserSubscriptionBonus, { grantCode: req.payload.grantCode })
    yield put(actions.contactsGrantBonusSuccess())
  } catch (error) {
    yield put(actions.contactsGrantBonusFailure(error))
  }
}

function* contactsGrantBonusSuccess() {
  const navigation = yield NavigationService.getNavigation()
  yield put(usersActions.usersGetProfileSelfRequest())

  navigationActions.navigateInviteFriendsSuccess(navigation)
}

export default () => [
  takeEvery(constants.CONTACTS_GRANT_BONUS_REQUEST, contactsGrantBonusRequest),
  takeEvery(constants.CONTACTS_GRANT_BONUS_SUCCESS, contactsGrantBonusSuccess),
  takeEvery(constants.CONTACTS_FOLLOW_SUCCESS, contactsCheckBonusRequest),
  takeEvery(constants.CONTACTS_INVITE_SUCCESS, contactsCheckBonusRequest),
  takeEvery(constants.CONTACTS_CHECK_BONUS_REQUEST, contactsCheckBonusRequest),
]
