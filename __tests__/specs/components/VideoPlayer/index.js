import React from 'react'
import VideoPlayer from 'components/VideoPlayer'
import { renderWithStore } from 'tests/utils'

jest.mock('react-native-video', () => () => null)

const defaultResolution = {
  width: 3840,
  height: 2160,
}

const setup = (props) => renderWithStore(
  <VideoPlayer
    resolution={defaultResolution}
    {...props}
  />,
)

describe('VideoPlayer component', () => {
  it('should render progress when playing', () => {
    const { queryByTestId } = setup({
      playing: true,
    })

    expect(queryByTestId('progress')).toBeTruthy()
  })

  it('should not render progress when paused', () => {
    const { queryByTestId } = setup()

    expect(queryByTestId('progress')).toBeNull()
  })

})
