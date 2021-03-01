import { createAction } from 'redux-actions'
import { createFailureAction } from 'store/errors'
import * as constants from 'store/ducks/promocodes/constants'

/**
 *
 */
export const promoCodesRedeemRequest = createAction(constants.PROMO_CODES_REDEEM_REQUEST)
export const promoCodesRedeemSuccess = createAction(constants.PROMO_CODES_REDEEM_SUCCESS)
export const promoCodesRedeemFailure = createFailureAction(constants.PROMO_CODES_REDEEM_FAILURE)
