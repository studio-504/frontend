import { combineReducers } from 'redux'
import { applyActions } from 'tests/utils/helpers'
import contacts from 'store/ducks/contacts/reducer'
import * as actions from 'store/ducks/contacts/actions'
import * as selectors from 'store/ducks/contacts/selectors'

const reducer = combineReducers({ contacts })
const error = new Error('Error')

describe('Contacts reducer', () => {
  it('initial state', () => {
    const state = reducer(undefined, { type: 'MOCK_ACTION' })

    expect(selectors.contactsGet(state)).toEqual({
      error: '',
      status: 'idle',
    })
  })

  it('loading state', () => {
    const state = reducer(undefined, actions.contactsGetRequest())

    expect(selectors.contactsGet(state)).toEqual({
      error: '',
      status: 'loading',
    })
  })

  it('success state', () => {
    const state = reducer(undefined, actions.contactsGetSuccess())

    expect(selectors.contactsGet(state)).toEqual({
      error: '',
      status: 'success',
    })
  })

  it('error state', () => {
    const state = reducer(undefined, actions.contactsGetFailure(error.message))

    expect(selectors.contactsGet(state)).toEqual({
      error: error.message,
      status: 'failure',
    })
  })

  it('clear error on request', () => {
    const state = applyActions([actions.contactsGetFailure(error.message), actions.contactsGetRequest()], reducer)

    expect(selectors.contactsGet(state)).toEqual({
      error: '',
      status: 'loading',
    })
  })
})
