import { combineReducers } from 'redux'
import users from 'store/ducks/users/reducer'
import * as actions from 'store/ducks/users/actions'
import * as selectors from 'store/ducks/users/selectors'
import { applyActions } from 'tests/utils/helpers'

const reducer = combineReducers({ users })

describe('Users reducer', () => {
  describe('usersChangeAvatar', () => {
    const error = 'error'

    it('initial state', () => {
      const state = reducer(undefined, { type: 'MOCK' })

      expect(selectors.usersChangeAvatar(state)).toEqual({ status: 'idle', error: {} })
    })

    it('loading', () => {
      const state = reducer(undefined, actions.usersChangeAvatarRequest())

      expect(selectors.usersChangeAvatar(state)).toEqual({ status: 'loading', error: {} })
    })

    it('success', () => {
      const state = reducer(undefined, actions.usersChangeAvatarSuccess())

      expect(selectors.usersChangeAvatar(state)).toEqual({ status: 'success', error: {} })
    })

    it('failure', () => {
      const state = reducer(undefined, actions.usersChangeAvatarFailure({ message: { text: error } }))

      expect(selectors.usersChangeAvatar(state)).toEqual({ status: 'failure', error: { text: error } })
    })

    it('idle', () => {
      const state = applyActions(
        [
          actions.usersChangeAvatarSuccess(),
          actions.usersChangeAvatarFailure({ message: { text: error } }),
          actions.usersChangeAvatarIdle(),
        ],
        reducer,
      )

      expect(selectors.usersChangeAvatar(state)).toEqual({ status: 'idle', error: {} })
    })
  })

  describe('usersImagePostsGet', () => {
    const selector = selectors.usersImagePostsGetSelector()

    it('initial state', () => {
      const state = reducer(undefined, { type: 'MOCK' })

      expect(selector(state)).toEqual({
        data: [],
        status: 'idle',
        error: {},
        payload: {},
      })
    })

    it('loading', () => {
      const payload = { userId: 1 }
      const state = reducer(undefined, actions.usersImagePostsGetRequest(payload))

      expect(selector(state)).toEqual({
        data: [],
        status: 'loading',
        error: {},
        payload,
      })
    })

    it('success', () => {
      const data = [{ id: 1 }]
      const state = reducer(undefined, actions.usersImagePostsGetSuccess({ data }))

      expect(selector(state)).toEqual({
        data,
        status: 'success',
        error: {},
        payload: {},
      })
    })

    it('failure', () => {
      const error = { message: 'Error' }
      const state = reducer(undefined, actions.usersImagePostsGetFailure(error))

      expect(selector(state)).toEqual({
        data: [],
        status: 'failure',
        error: error.message,
        payload: {},
      })
    })
  })

  describe('usersSetUserDatingStatus', () => {
    it('initial state', () => {
      const state = reducer(undefined, { type: 'MOCK' })

      expect(selectors.usersSetUserDatingStatus(state)).toEqual({
        data: [],
        status: 'idle',
        error: {},
        payload: {},
      })
    })

    it('loading', () => {
      const payload = { userId: 1 }
      const state = reducer(undefined, actions.usersSetUserDatingStatusRequest(payload))

      expect(selectors.usersSetUserDatingStatus(state)).toEqual({
        data: [],
        status: 'loading',
        error: {},
        payload,
      })
    })

    it('success', () => {
      const data = [{ id: 1 }]
      const state = reducer(undefined, actions.usersSetUserDatingStatusSuccess({ data }))

      expect(selectors.usersSetUserDatingStatus(state)).toEqual({
        data,
        status: 'success',
        error: {},
        payload: {},
      })
    })

    it('failure', () => {
      const error = { message: 'Error' }
      const state = reducer(undefined, actions.usersSetUserDatingStatusFailure(error))

      expect(selectors.usersSetUserDatingStatus(state)).toEqual({
        data: [],
        status: 'failure',
        error: error.message,
        payload: {},
      })
    })
  })

  describe('usersGetProfileSelf', () => {
    const data = { a: 1, b: 2 }

    it('initial state', () => {
      const state = reducer(undefined, { type: 'MOCK' })

      expect(selectors.usersGetProfileSelf(state)).toEqual({ data: {}, status: 'idle', error: {} })
    })

    it('loading', () => {
      const state = reducer(undefined, actions.usersGetProfileSelfRequest())

      expect(selectors.usersGetProfileSelf(state)).toEqual({ data: {}, status: 'loading', error: {} })
    })

    it('success', () => {
      const state = reducer(undefined, actions.usersGetProfileSelfSuccess({ data }))

      expect(selectors.usersGetProfileSelf(state)).toEqual({ data, status: 'success', error: {} })
    })

    it('failure', () => {
      const message = 'Error'
      const state = reducer(undefined, actions.usersGetProfileSelfFailure({ message }))

      expect(selectors.usersGetProfileSelf(state)).toEqual({ data: {}, status: 'failure', error: message })
    })

    it('idle', () => {
      const state = applyActions(
        [actions.usersGetProfileSelfSuccess({ data }), actions.usersGetProfileSelfIdle()],
        reducer,
      )

      expect(selectors.usersGetProfileSelf(state)).toEqual({ data: {}, status: 'idle', error: {} })
    })
  })

  describe('usersSearch', () => {
    const selector = selectors.usersSearch()

    it('initial state', () => {
      const state = reducer(undefined, { type: 'MOCK' })

      expect(selector(state)).toEqual({ data: [], status: 'idle', error: {}, payload: {} })
    })
  })
})
