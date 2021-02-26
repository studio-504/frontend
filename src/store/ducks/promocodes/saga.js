import { put, call, takeEvery } from 'redux-saga/effects'
import * as usersActions from 'store/ducks/users/actions'
import * as constants from 'store/ducks/promocodes/constants'
import * as actions from 'store/ducks/promocodes/actions'
import * as queries from 'store/ducks/promocodes/queries'
import * as queryService from 'services/Query'
import * as navigationActions from 'navigation/actions'
import * as NavigationService from 'services/Navigation'

function* promoCodesRedeemRequest(req) {
  try {
    yield call(queryService.apiRequest, queries.redeemPromotion, { code: req.payload.code })
    yield put(actions.promoCodesRedeemSuccess())
  } catch (error) {
    yield put(actions.promoCodesRedeemFailure(error))
  }
}

function* promoCodesRedeemSuccess() {
  const navigation = yield NavigationService.getNavigation()
  yield put(usersActions.usersGetProfileSelfRequest())

  navigationActions.navigateInviteFriendsSuccess(navigation)
}

export default () => [
  takeEvery(constants.PROMO_CODES_REDEEM_REQUEST, promoCodesRedeemRequest),
  takeEvery(constants.PROMO_CODES_REDEEM_SUCCESS, promoCodesRedeemSuccess),
]
