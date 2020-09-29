import { createAction } from 'redux-actions'
import * as constants from 'store/ducks/contacts/constants'

/**
 * 
 */
export const contactsGetIdle = createAction(constants.CONTACTS_GET_IDLE)
export const contactsGetRequest = createAction(constants.CONTACTS_GET_REQUEST)
export const contactsGetSuccess = createAction(constants.CONTACTS_GET_SUCCESS)
export const contactsGetFailure = createAction(constants.CONTACTS_GET_FAILURE)