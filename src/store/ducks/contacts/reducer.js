import { handleActions } from 'redux-actions'
import update from 'immutability-helper'
import * as constants from 'store/ducks/contacts/constants'

export const initialState = {
  contactsGet: {
    status: 'idle',
    items: [],
  },
  contactsInvite: {
    status: 'idle',
    invited: {},
    requested: {},
  },
}

/**
 *
 */
const contactsGetRequest = (state) =>
  update(state, {
    contactsGet: {
      status: { $set: 'loading' },
    },
  })

const contactsGetSuccess = (state, action) =>
  update(state, {
    contactsGet: {
      status: { $set: 'success' },
      items: { $set: action.payload.data },
    },
  })

const contactsGetFailure = (state) =>
  update(state, {
    contactsGet: {
      status: { $set: 'failure' },
      items: { $set: initialState.contactsGet.items },
    },
  })

/**
 *
 */
const contactsInviteRequest = (state, action) =>
  update(state, {
    contactsInvite: {
      status: { $set: 'loading' },
      requested: { $merge: { [action.payload.contactId]: true } },
    },
  })

const contactsInviteSuccess = (state, action) =>
  update(state, {
    contactsInvite: {
      status: { $set: 'success' },
      invited: { $merge: { [action.payload.contactId]: true } },
      requested: { $unset: [action.payload.contactId] },
    },
  })

const contactsInviteFailure = (state, action) =>
  update(state, {
    contactsInvite: {
      status: { $set: 'failure' },
      requested: { $unset: [action.meta.contactId] },
    },
  })

export default handleActions(
  {
    [constants.CONTACTS_GET_REQUEST]: contactsGetRequest,
    [constants.CONTACTS_GET_SUCCESS]: contactsGetSuccess,
    [constants.CONTACTS_GET_FAILURE]: contactsGetFailure,

    [constants.CONTACTS_INVITE_REQUEST]: contactsInviteRequest,
    [constants.CONTACTS_INVITE_SUCCESS]: contactsInviteSuccess,
    [constants.CONTACTS_INVITE_FAILURE]: contactsInviteFailure,

    [constants.CONTACTS_FOLLOW_REQUEST]: contactsInviteRequest,
    [constants.CONTACTS_FOLLOW_SUCCESS]: contactsInviteSuccess,
    [constants.CONTACTS_FOLLOW_FAILURE]: contactsInviteFailure,
  },
  initialState,
) 
