import { PERMISSIONS, RESULTS, check, request } from 'react-native-permissions'
import { takeLeading, call, getContext, put } from 'redux-saga/effects'
import * as constants from 'store/ducks/contacts/constants'
import * as actions from 'store/ducks/contacts/actions'

function* requestContactsPermission() {
  const status = yield call(check, PERMISSIONS.IOS.CONTACTS)

  if (status === RESULTS.DENIED) {
    return yield call(request, PERMISSIONS.IOS.CONTACTS)
  } else {
    return status
  }
}

function* contactsGetRequest() {
  const errorWrapper = yield getContext('errorWrapper')

  try {
    const permission = yield call(requestContactsPermission)

    if ([RESULTS.BLOCKED, RESULTS.UNAVAILABLE, RESULTS.DENIED].includes(permission)) {
      throw new Error(`Contacts permission is ${permission}`)
    }

    yield put(actions.contactsGetSuccess({ items: [] })) 
  } catch (error) {
    yield put(actions.contactsGetFailure(errorWrapper(error)))
  }
}

export default () => [takeLeading(constants.CONTACTS_GET_REQUEST, contactsGetRequest)]
