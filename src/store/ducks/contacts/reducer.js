import { handleActions } from 'redux-actions'
import update from 'immutability-helper'
import * as constants from 'store/ducks/contacts/constants'

const initialState = {
  contactsGet: {
    status: 'idle',
    error: '',
  },
}

/**
 *
 */
const contactsGetRequest = (state) =>
  update(state, {
    contactsGet: {
      status: { $set: 'loading' },
      error: { $set: initialState.contactsGet.error },
    },
  })

const contactsSuccess = (state) =>
  update(state, {
    contactsGet: {
      status: { $set: 'success' },
    },
  })

const contactsFailure = (state, action) =>
  update(state, {
    contactsGet: {
      status: { $set: 'failure' },
      error: { $set: action.payload },
    },
  })

export default handleActions(
  {
    [constants.CONTACTS_GET_REQUEST]: contactsGetRequest,
    [constants.CONTACTS_GET_SUCCESS]: contactsSuccess,
    [constants.CONTACTS_GET_FAILURE]: contactsFailure,
  },
  initialState,
)
