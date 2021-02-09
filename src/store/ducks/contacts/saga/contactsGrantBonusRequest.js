import { put, call, select } from 'redux-saga/effects'
import * as usersActions from 'store/ducks/users/actions'
import * as selectors from 'store/ducks/contacts/selectors'
import * as queries from 'store/ducks/contacts/queries'
import * as queryService from 'services/Query'
import * as contactsConstants from 'store/ducks/contacts/constants'
import * as navigationActions from 'navigation/actions'
import * as NavigationService from 'services/Navigation'

function* contactsGrantBonusRequest() {
  try {
    const { invited } = yield select(selectors.contactsInvite)

    if (Object.keys(invited).length === contactsConstants.CONTACTS_INVITE_LIMIT) {
      const navigation = yield NavigationService.getNavigation()
      
      yield call(queryService.apiRequest, queries.grantUserSubscriptionBonus)
      yield put(usersActions.usersGetProfileSelfRequest())

      navigationActions.navigateInviteFriendsSuccess(navigation)
    }
  } catch (error) {
    // ignore
  }
}

export default contactsGrantBonusRequest
