import { handleActions } from 'redux-actions'
import update from 'immutability-helper'
import * as constants from 'store/ducks/purchases/constants'

const initialState = {
  purchasesRequest: {
    status: 'idle',
    error: '',
  },
}

/**
 *
 */
const purchasesRequest = (state) =>
  update(state, {
    purchasesRequest: {
      status: { $set: 'loading' },
      error: { $set: initialState.purchasesRequest.error },
    },
  })

const purchasesSuccess = (state) =>
  update(state, {
    purchasesRequest: {
      status: { $set: 'success' },
    },
  })

const purchasesFailure = (state, action) =>
  update(state, {
    purchasesRequest: {
      status: { $set: 'failure' },
      error: { $set: action.payload },
    },
  })

export default handleActions(
  {
    [constants.PURCHASE_REQUEST]: purchasesRequest,
    [constants.PURCHASE_SUCCESS]: purchasesSuccess,
    [constants.PURCHASE_FAILURE]: purchasesFailure,
  },
  initialState,
)
