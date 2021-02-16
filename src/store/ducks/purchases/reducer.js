import { handleActions } from 'redux-actions'
import update from 'immutability-helper'
import * as constants from 'store/ducks/purchases/constants'

export const initialState = {
  purchasesRequest: {
    status: 'idle',
  },
  retryPurchase: {
    status: 'idle',
  },
}

/**
 *
 */
const purchasesRequest = (state) =>
  update(state, {
    purchasesRequest: {
      status: { $set: 'loading' },
    },
    retryPurchase: { $set: initialState.retryPurchase },
  })

const purchaseSuccess = (state) =>
  update(state, {
    purchasesRequest: {
      status: { $set: 'success' },
    },
  })

const purchasesFailure = (state) =>
  update(state, {
    purchasesRequest: {
      status: { $set: 'failure' },
    },
  })

/**
 *
 */
const retryPurchaseRequest = (state) =>
  update(state, {
    purchasesRequest: { $set: initialState.purchasesRequest },
    retryPurchase: {
      status: { $set: 'loading' },
    },
  })

const retryPurchaseSuccess = (state) =>
  update(state, {
    retryPurchase: {
      status: { $set: 'success' },
    },
  })

const retryPurchaseFailure = (state) =>
  update(state, {
    retryPurchase: {
      status: { $set: 'failure' },
    },
  })

export default handleActions(
  {
    [constants.PURCHASE_REQUEST]: purchasesRequest,
    [constants.PURCHASE_SUCCESS]: purchaseSuccess,
    [constants.PURCHASE_FAILURE]: purchasesFailure,

    [constants.RETRY_PURCHASE_REQUEST]: retryPurchaseRequest,
    [constants.RETRY_PURCHASE_SUCCESS]: retryPurchaseSuccess,
    [constants.RETRY_PURCHASE_FAILURE]: retryPurchaseFailure,
  },
  initialState,
)
