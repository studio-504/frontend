import reducer from 'store/ducks/player/reducer'
import * as constants from 'store/ducks/player/constants'

const initialState = {
  muted: true,
}

describe('Player reducer', () => {
  it('should return initial state', () => {
    const state = reducer(undefined, {})
    expect(state).toEqual(initialState)
  })

  it('should toggle sound', () => {
    const state = reducer(undefined, { type: constants.TOGGLE_SOUND })
    expect(state).toEqual({
      muted: false,
    })

    const toggleAgain = reducer(state, { type: constants.TOGGLE_SOUND })
    expect(toggleAgain).toEqual({
      muted: true,
    })
  })
})
