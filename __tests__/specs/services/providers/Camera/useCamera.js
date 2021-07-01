import { useDispatch } from 'react-redux'
import { useNavigation } from '@react-navigation/native'
import { renderHook } from '@testing-library/react-hooks'
import CropPicker from 'react-native-image-crop-picker'
import useCamera from 'services/providers/Camera/useCamera'
import useCameraState from 'services/providers/Camera/useCameraState'
import * as authSelector from 'store/ducks/auth/selectors'

const cameraStateValue = ({
  postsCreate: 'postsCreate',
  flashMode: 'flashMode',
  handleFlashToggle: 'handleFlashToggle',
  flipMode: 'flipMode',
  handleFlipToggle: 'handleFlipToggle',
  mediaSize: 'mediaSize',
  setMediaSize: 'setMediaSize',
  recordedDuration: 'recordedDuration',
  setRecordedDuration: 'setRecordedDuration',
})

const cropOptionsValue = ({
  state: {
    mediaSize: 'mediaSize',
  },
  
  snappedMedia: {
    uri: 'uri',
    path: 'path',
    extension: 'extension',
    format: 'format',
  },
  
  croppedMedia: {
    path: 'path',
    cropRect: {
      x: 'x',
      y: 'y',
      width: 'width',
      height: 'height',
    },
  },
})

jest.spyOn(authSelector, 'authUser').mockReturnValue({ userStatus: 'ACTIVE' })
jest.mock('react-redux', () => ({ useDispatch: jest.fn(), useSelector: (cb) => cb() }))
jest.mock('@react-navigation/native', () => ({ useNavigation: jest.fn() }))
jest.mock('services/providers/Camera/useCameraState')
jest.mock('react-native-image-crop-picker', () => ({ openCropper: jest.fn() }))

const dispatch = jest.fn()
useDispatch.mockReturnValue(dispatch)

const navigation = { popToTop: jest.fn(), navigate: jest.fn() }
useNavigation.mockReturnValue(navigation)

const openCropper = jest.fn(() => cropOptionsValue)
CropPicker.openCropper.mockReturnValue(openCropper)

useCameraState.mockReturnValue(cameraStateValue)

describe('PostType screen', () => {
  beforeEach(() => {
    dispatch.mockClear()
    navigation.navigate.mockClear()
    navigation.popToTop.mockClear()
    openCropper.mockClear()
  })

  it('should provide handleProcessedMedia for useCamera hook', async () => {
    const cameraRef = {
      current: {
        pausePreview: jest.fn(),
        takePictureAsync: jest.fn(() => Promise.resolve(1)),
      },
    }
    const { result } = renderHook(() => useCamera({ cameraRef }))

    result.current.handleCameraSnap()
    expect(await cameraRef.current.pausePreview).toHaveBeenCalled()
    expect(await cameraRef.current.takePictureAsync).toHaveBeenCalled()
    expect(CropPicker.openCropper).toHaveBeenCalled()
  })
})
