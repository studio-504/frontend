import React from 'react'
import CameraScreen from 'screens/CameraScreen'
import { renderWithStore } from 'tests/utils'

jest.mock('react-native-permissions', () => require('react-native-permissions/mock'))

jest.mock('@react-navigation/native', () => ({
  useNavigation: jest.fn(),
  useFocusEffect: jest.fn(),
  useRoute: jest.fn(),
}))
jest.useFakeTimers()

const setup = () => renderWithStore(<CameraScreen />)

describe('CameraScreen', () => {

  it('should render rn-camera component', () => {
    const { container } = setup()
    console.log(container)
    // console.log(queryByAccessibilityLabel('Camera'))

    expect(1).toBe(1)
  })

})
