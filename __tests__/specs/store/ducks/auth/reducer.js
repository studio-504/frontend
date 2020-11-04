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
        message: {},
        payload: {},
      })
    })

    it('loading', () => {
      const payload = { a: 1, b: 2 }
      const state = reducer(undefined, actions.authForgotRequest(payload))

      expect(selectors.authForgot(state)).toEqual({
        status: 'loading',
        error: {},
        message: {},
        payload,
      })
    })

    it('success', () => {
      const message = 'Message'
      const state = reducer(undefined, actions.authForgotSuccess({ message }))

      expect(selectors.authForgot(state)).toEqual({
        status: 'success',
        error: {},
        message,
        payload: {},
      })
    })

    it('failure', () => {
      const message = 'Error Message'
      const state = reducer(undefined, actions.authForgotFailure({ message }))

      expect(selectors.authForgot(state)).toEqual({
        status: 'failure',
        error: message,
        message,
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
        message: {},
        payload: {},
      })
    })
  })
})
