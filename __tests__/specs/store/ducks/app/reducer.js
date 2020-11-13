import { combineReducers } from 'redux'
import app from 'store/ducks/app/reducer'
import * as actions from 'store/ducks/app/actions'
import * as selectors from 'store/ducks/app/selectors'
import { applyActions } from 'tests/utils/helpers'

const reducer = combineReducers({ app })

describe('App reducer', () => {
  describe('appReady', () => {
    const data = { a: 1, b: 2 }
    const meta = { c: 3 }

    it('initial state', () => {
      const state = reducer(undefined, { type: 'MOCK' })

      expect(selectors.appReady(state)).toEqual({
        data: [],
        status: 'idle',
        error: {},
        payload: {},
        meta: {},
      })
    })

    it('loading', () => {
      const state = reducer(undefined, actions.appReadyRequest())

      expect(selectors.appReady(state)).toEqual({
        data: [],
        status: 'loading',
        error: {},
        payload: {},
        meta: {},
      })
    })

    it('success', () => {
      const state = applyActions(
        [actions.appReadyFailure({ message: 'Error' }), actions.appReadySuccess({ data, meta })],
        reducer,
      )

      expect(selectors.appReady(state)).toEqual({
        data,
        status: 'success',
        error: {},
        payload: {},
        meta,
      })
    })

    it('failure', () => {
      const message = 'Error Message'
      const state = applyActions(
        [actions.appReadySuccess({ data, meta }), actions.appReadyFailure({ message, meta: { h: 7 } })],
        reducer,
      )

      expect(selectors.appReady(state)).toEqual({
        data: [],
        status: 'failure',
        error: message,
        payload: {},
        meta: { h: 7 },
      })
    })

    it('idle', () => {
      const state = applyActions([actions.appReadySuccess({ data, meta }), actions.appReadyIdle()], reducer)

      expect(selectors.appReady(state)).toEqual({
        data: [],
        status: 'idle',
        error: {},
        payload: {},
        meta: {},
      })
    })
  })
})
