import { takeLeading, takeEvery } from 'redux-saga/effects'
import * as contactsConstants from 'store/ducks/contacts/constants'
import contactsGetRequest from 'store/ducks/contacts/saga/contactsGet'
import contactsInviteRequest from 'store/ducks/contacts/saga/contactsInvite'
import contactsFollowRequest from 'store/ducks/contacts/saga/contactsFollow'

export default () => [
  takeLeading(contactsConstants.CONTACTS_GET_REQUEST, contactsGetRequest),
  takeLeading(contactsConstants.CONTACTS_INVITE_REQUEST, contactsInviteRequest),
  takeEvery(contactsConstants.CONTACTS_FOLLOW_REQUEST, contactsFollowRequest),
]
