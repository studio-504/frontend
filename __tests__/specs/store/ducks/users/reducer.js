import { combineReducers } from 'redux'
import users from 'store/ducks/users/reducer'
import * as actions from 'store/ducks/users/actions'
import * as selectors from 'store/ducks/users/selectors'
import { applyActions } from 'tests/utils/helpers'

const reducer = combineReducers({ users })
const error = new Error('Error')

describe('Users reducer', () => {
  describe('usersChangeAvatar', () => {
    it('initial state', () => {
      const state = reducer(undefined, { type: 'MOCK' })

      expect(selectors.usersChangeAvatar(state)).toEqual({ status: 'idle' })
    })

    it('loading', () => {
      const state = reducer(undefined, actions.usersChangeAvatarRequest())

      expect(selectors.usersChangeAvatar(state)).toEqual({ status: 'loading' })
    })

    it('success', () => {
      const state = reducer(undefined, actions.usersChangeAvatarSuccess())

      expect(selectors.usersChangeAvatar(state)).toEqual({ status: 'success' })
    })

    it('failure', () => {
      const state = reducer(undefined, actions.usersChangeAvatarFailure(error))

      expect(selectors.usersChangeAvatar(state)).toEqual({ status: 'failure' })
    })

    it('idle', () => {
      const state = applyActions(
        [actions.usersChangeAvatarSuccess(), actions.usersChangeAvatarFailure(error), actions.usersChangeAvatarIdle()],
        reducer,
      )

      expect(selectors.usersChangeAvatar(state)).toEqual({ status: 'idle' })
    })
  })

  describe('usersImagePostsGet', () => {
    const selector = selectors.usersImagePostsGetSelector()

    it('initial state', () => {
      const state = reducer(undefined, { type: 'MOCK' })

      expect(selector(state)).toEqual({
        data: [],
        status: 'idle',
        payload: {},
      })
    })

    it('loading', () => {
      const payload = { userId: '1' }
      const state = reducer(undefined, actions.usersImagePostsGetRequest(payload))

      expect(selector(state)).toEqual({
        data: [],
        status: 'loading',
        payload,
      })
    })

    it('success', () => {
      const data = [{ id: 1 }]
      const state = reducer(undefined, actions.usersImagePostsGetSuccess({ data }))

      expect(selector(state)).toEqual({
        data,
        status: 'success',
        payload: {},
      })
    })

    it('failure', () => {
      const state = reducer(undefined, actions.usersImagePostsGetFailure(error))

      expect(selector(state)).toEqual({
        data: [],
        status: 'failure',
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

        payload: {},
      })
    })

    it('loading', () => {
      const payload = { userId: '1' }
      const state = reducer(undefined, actions.usersSetUserDatingStatusRequest(payload))

      expect(selectors.usersSetUserDatingStatus(state)).toEqual({
        data: [],
        status: 'loading',

        payload,
      })
    })

    it('success', () => {
      const data = [{ id: 1 }]
      const state = reducer(undefined, actions.usersSetUserDatingStatusSuccess({ data }))

      expect(selectors.usersSetUserDatingStatus(state)).toEqual({
        data,
        status: 'success',
        payload: {},
      })
    })

    it('failure', () => {
      const state = reducer(undefined, actions.usersSetUserDatingStatusFailure(error))

      expect(selectors.usersSetUserDatingStatus(state)).toEqual({
        data: [],
        status: 'failure',
        payload: {},
      })
    })
  })

  describe('usersSearch', () => {
    const selector = selectors.usersSearch()

    it('initial state', () => {
      const state = reducer(undefined, { type: 'MOCK' })

      expect(selector(state)).toEqual({ data: [], status: 'idle', payload: {} })
    })
  })
})
