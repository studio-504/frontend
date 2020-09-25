import { createAction } from 'redux-actions'
import * as constants from 'store/ducks/purchases/constants'

/**
 *
 */
export const purchaseRequest = createAction(constants.PURCHASE_REQUEST)
export const purchaseSuccess = createAction(constants.PURCHASE_SUCCESS)
export const purchaseFailure = createAction(constants.PURCHASE_FAILURE)
