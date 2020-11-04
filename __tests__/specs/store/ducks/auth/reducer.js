import { combineReducers } from 'redux'
import auth from 'store/ducks/auth/reducer'
import * as actions from 'store/ducks/auth/actions'
import * as selectors from 'store/ducks/auth/selectors'
import { applyActions } from 'tests/utils/helpers'

const reducer = combineReducers({ auth })

describe('Auth reducer', () => {
  describe('authForgot', () => {
    it('initial state', () => {
      const state = reducer(undefined, { type: 'MOCK' })

      expect(selectors.authForgot(state)).toEqual({
        status: 'idle',
        error: {},
        payload: {},
      })
    })

    it('loading', () => {
      const state = applyActions(
        [
          actions.authForgotRequest({ a: 1, b: 2 }),
          actions.authForgotRequest({ c: 3 }),
          actions.authForgotRequest({ a: 4, b: 5 }),
        ],
        reducer,
      )

      expect(selectors.authForgot(state)).toEqual({
        status: 'loading',
        error: {},
        payload: { a: 4, b: 5, c: 3 },
      })
    })

    it('success', () => {
      const state = reducer(undefined, actions.authForgotSuccess())

      expect(selectors.authForgot(state)).toEqual({
        status: 'success',
        error: {},
        payload: {},
      })
    })

    it('failure', () => {
      const message = 'Error Message'
      const state = reducer(undefined, actions.authForgotFailure({ message }))

      expect(selectors.authForgot(state)).toEqual({
        status: 'failure',
        error: message,
        payload: {},
      })
    })

    it('idle', () => {
      const state = applyActions(
        [
          actions.authForgotSuccess({ message: 'Message' }),
          actions.authForgotFailure({ message: 'Error' }),
          actions.authForgotIdle(),
        ],
        reducer,
      )

      expect(selectors.authForgot(state)).toEqual({
        status: 'idle',
        error: {},
        payload: {},
      })
    })
  })
})
