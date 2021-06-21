import { applyActions } from 'tests/utils/helpers'
import playerReducer from 'store/ducks/player/reducer'
import * as playerActions from 'store/ducks/player/actions'

const initialState = {
  muted: true
}

describe('Player reducer', () => {
  it('should return initial state', () => {
    const state = playerReducer(undefined, {})
    expect(state).toEqual(initialState)
  })

  it('should toggle sound', () => {
    const state = applyActions([playerActions.toggleSound()], playerReducer)
    expect(state).toEqual({
      muted: false
    })
  })
})
