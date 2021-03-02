import { handleActions } from 'redux-actions'
import update from 'immutability-helper'
import * as constants from 'store/ducks/promocodes/constants'

export const initialState = {
  promoCodesRedeem: {
    status: 'idle',
  },
}

/**
 *
 */
const promoCodesRedeemRequest = (state) =>
  update(state, {
    promoCodesRedeem: {
      status: { $set: 'loading' },
    },
  })

const promoCodesRedeemSuccess = (state) =>
  update(state, {
    promoCodesRedeem: {
      status: { $set: 'success' },
    },
  })

const promoCodesRedeemFailure = (state) =>
  update(state, {
    promoCodesRedeem: {
      status: { $set: 'failure' },
    },
  })

export default handleActions(
  {
    [constants.PROMO_CODES_REDEEM_REQUEST]: promoCodesRedeemRequest,
    [constants.PROMO_CODES_REDEEM_SUCCESS]: promoCodesRedeemSuccess,
    [constants.PROMO_CODES_REDEEM_FAILURE]: promoCodesRedeemFailure,
  },
  initialState,
)
