import { getContext } from 'redux-saga/effects'
import { expectSaga } from 'redux-saga-test-plan'
import * as matchers from 'redux-saga-test-plan/matchers'
import Contacts from 'react-native-contacts'
import { PERMISSIONS, RESULTS, check, request } from 'react-native-permissions'
import contacts from 'store/ducks/contacts/saga'
import * as actions from 'store/ducks/contacts/actions'
import { testAsRootSaga } from 'tests/utils/helpers'
import { errorWrapper } from 'store/helpers'

jest.mock('react-native-contacts', () => ({ getAll: jest.fn((cb) => cb(new Error('Get All Error'), undefined)) }))

jest.mock('react-native-permissions', () => ({
  check: jest.fn(),
  request: jest.fn(),
  PERMISSIONS: { IOS: { CONTACTS: 'CONTACTS' } },
  RESULTS: {
    DENIED: 'DENIED',
    BLOCKED: 'BLOCKED',
    UNAVAILABLE: 'UNAVAILABLE',
    GRANTED: 'GRANTED',
  },
}))

describe('Contacts saga', () => {
  it('Permission UNAVAILABLE', () => {
    const context = [
      [matchers.call.fn(check), RESULTS.UNAVAILABLE],
      [getContext('errorWrapper'), errorWrapper],
    ]

    return expectSaga(testAsRootSaga(contacts))
      .provide(context)

      .call(check, PERMISSIONS.IOS.CONTACTS)
      .not.call(request, PERMISSIONS.IOS.CONTACTS)
      .put(actions.contactsGetFailure('Contacts permission is UNAVAILABLE'))

      .dispatch(actions.contactsGetRequest())
      .silentRun()
  })

  it('Permission BLOCKED', () => {
    const context = [
      [matchers.call.fn(check), RESULTS.BLOCKED],
      [getContext('errorWrapper'), errorWrapper],
    ]

    return expectSaga(testAsRootSaga(contacts))
      .provide(context)

      .call(check, PERMISSIONS.IOS.CONTACTS)
      .not.call(request, PERMISSIONS.IOS.CONTACTS)
      .put(actions.contactsGetFailure('Contacts permission is BLOCKED'))

      .dispatch(actions.contactsGetRequest())
      .silentRun()
  })

  it('Permission DENIED', () => {
    const context = [
      [matchers.call.fn(check), RESULTS.DENIED],
      [matchers.call.fn(request), RESULTS.DENIED],
      [getContext('errorWrapper'), errorWrapper],
    ]

    return expectSaga(testAsRootSaga(contacts))
      .provide(context)

      .call(check, PERMISSIONS.IOS.CONTACTS)
      .call(request, PERMISSIONS.IOS.CONTACTS)
      .put(actions.contactsGetFailure('Contacts permission is DENIED'))

      .dispatch(actions.contactsGetRequest())
      .silentRun()
  })

  it('failed get contacts', () => {
    const context = [
      [matchers.call.fn(check), RESULTS.GRANTED],
      [getContext('errorWrapper'), errorWrapper],
    ]

    return expectSaga(testAsRootSaga(contacts))
      .provide(context)

      .call(check, PERMISSIONS.IOS.CONTACTS)
      .put(actions.contactsGetFailure('Get All Error'))

      .dispatch(actions.contactsGetRequest())
      .silentRun()
  })

  it('success', () => {
    const items = [{ id: 1 }, { id: 2 }]
    Contacts.getAll.mockImplementationOnce((cb) => cb(null, items))

    const context = [
      [matchers.call.fn(check), RESULTS.GRANTED],
      [getContext('errorWrapper'), errorWrapper],
    ]

    return expectSaga(testAsRootSaga(contacts))
      .provide(context)

      .call(check, PERMISSIONS.IOS.CONTACTS)
      .put(actions.contactsGetSuccess({ items }))

      .dispatch(actions.contactsGetRequest())
      .silentRun()
  })
})
