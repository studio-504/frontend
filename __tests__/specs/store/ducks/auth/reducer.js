import { combineReducers } from 'redux'
import auth from 'store/ducks/auth/reducer'
import * as actions from 'store/ducks/auth/actions'
import * as selectors from 'store/ducks/auth/selectors'
import { applyActions } from 'tests/utils/helpers'

const reducer = combineReducers({ auth })
const error = new Error('Error Message')

describe('Auth reducer', () => {
  describe('authSigninCognito', () => {
    it('initial state', () => {
      const state = reducer(undefined, { type: 'MOCK' })

      expect(selectors.authSigninCognito(state)).toEqual({
        status: 'idle',
        payload: {},
      })
    })

    it('loading', () => {
      const state = applyActions(
        [
          actions.authSigninCognitoRequest({ a: 1, b: 2 }),
          actions.authSigninCognitoRequest({ c: 3 }),
          actions.authSigninCognitoRequest({ a: 4, b: 5 }),
        ],
        reducer,
      )

      expect(selectors.authSigninCognito(state)).toEqual({
        status: 'loading',
        payload: { a: 4, b: 5, c: 3 },
      })
    })

    it('clear an error on request', () => {
      const state = applyActions(
        [actions.authSigninCognitoFailure(error), actions.authSigninCognitoRequest({ c: 3 })],
        reducer,
      )

      expect(selectors.authSigninCognito(state)).toEqual({
        status: 'loading',
        payload: { c: 3 },
      })
    })

    it('success', () => {
      const state = reducer(undefined, actions.authSigninCognitoSuccess())

      expect(selectors.authSigninCognito(state)).toEqual({
        status: 'success',
        payload: {},
      })
    })

    it('failure', () => {
      const error = new Error('Error Message')
      const state = reducer(undefined, actions.authSigninCognitoFailure(error))

      expect(selectors.authSigninCognito(state)).toEqual({
        status: 'failure',
        payload: {},
      })
    })

    it('idle', () => {
      const state = applyActions(
        [
          actions.authSigninCognitoSuccess({ message: 'Message' }),
          actions.authSigninCognitoFailure(error),
          actions.authSigninCognitoIdle(),
        ],
        reducer,
      )

      expect(selectors.authSigninCognito(state)).toEqual({
        status: 'idle',
        payload: {},
      })
    })
  })

  describe('authForgot', () => {
    it('initial state', () => {
      const state = reducer(undefined, { type: 'MOCK' })

      expect(selectors.authForgot(state)).toEqual({
        status: 'idle',
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
        payload: { a: 4, b: 5, c: 3 },
      })
    })

    it('success', () => {
      const state = reducer(undefined, actions.authForgotSuccess())

      expect(selectors.authForgot(state)).toEqual({
        status: 'success',
        payload: {},
      })
    })

    it('failure', () => {
      const error = new Error('Error Message')
      const state = reducer(undefined, actions.authForgotFailure(error))

      expect(selectors.authForgot(state)).toEqual({
        status: 'failure',
        payload: {},
      })
    })

    it('idle', () => {
      const state = applyActions(
        [actions.authForgotSuccess({ message: 'Message' }), actions.authForgotFailure(error), actions.authForgotIdle()],
        reducer,
      )

      expect(selectors.authForgot(state)).toEqual({
        status: 'idle',
        payload: {},
      })
    })
  })
})
