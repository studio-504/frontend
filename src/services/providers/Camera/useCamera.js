import { useRef, useState } from 'react'
import { Animated } from 'react-native'
import CropPicker from 'react-native-image-crop-picker'
import { useSelector } from 'react-redux'
import useToggle from 'react-use/lib/useToggle'
import * as postsSelector from 'store/ducks/posts/selectors'
import { autoKeyboardClose, cropperOptions, requestPayload, handleError } from 'services/providers/Camera/helpers'
import { MAX_VIDEO_RECORD_DURATION } from 'store/ducks/player/constants'

/**
 * react-native-camera request object
 */
const cameraOptions = () => ({
  quality: 1,
  base64: false,
  writeExif: true,
  exif: true,
  mirrorImage: false,
})

const useCameraState = () => {
  const postsCreate = useSelector(postsSelector.postsCreate)
  const [flashMode, handleFlashToggle] = useToggle(false)
  const [flipMode, handleFlipToggle] = useToggle(false)
  const [mediaSize, setMediaSize] = useState('4:3')
  const [recordedDuration, setRecordedDuration] = useState(0)

  return {
    postsCreate,
    flashMode,
    handleFlashToggle,
    flipMode,
    handleFlipToggle,
    mediaSize,
    setMediaSize,
    recordedDuration,
    setRecordedDuration,
  }
}

const useCamera = ({ handleProcessedMedia = () => {} }) => {
  const cameraState = useCameraState()
  const cameraRef = useRef(null)
  const recordIntervalRef = useRef()
  const shutterButtonScale = useRef(new Animated.Value(1)).current

  /**
   * Handle camera photo capture
   */
  const handleCameraSnap = async () => {
    /**
     * Camera module might eventually throw an error when camera is not initialized on native side
     */
    try {
      if (!cameraRef.current) return
      cameraRef.current.pausePreview()
      const snappedPhoto = await cameraRef.current.takePictureAsync(cameraOptions())
      const croppedPhoto = await CropPicker.openCropper(cropperOptions(cameraState, snappedPhoto))
      const payload = await requestPayload('camera')(cameraState, snappedPhoto, croppedPhoto)
      handleProcessedMedia([payload])
      cameraRef.current.resumePreview()
      autoKeyboardClose()
    } catch (error) {
      handleError(error)
    }
  }

  /**
   * Handle camera video recording
   */
  const handleVideoRecord = async () => {

    /**
     * Camera module might eventually throw an error when camera is not initialized on native side
     */
    try {
      if (!cameraRef.current) return
      const promise = cameraRef.current.recordAsync({
        maxDuration: MAX_VIDEO_RECORD_DURATION,
      })
      if (promise) {
        handleShutterButtonAnimation(1.4)
        recordIntervalRef.current = setInterval(() => {
          cameraState.setRecordedDuration(duration => {
            if (duration === MAX_VIDEO_RECORD_DURATION - 1)
            {
              handleVideoRecordEnd(false)
              return 0
            }
            return duration + 1
          })
        }, 1000)
        const recordedVideo = { ...await promise, ...{
          extension: 'mov',
          format: 'mov',
        } }
        const croppedVideo = {
          path: '',
          cropRect: {
            x: 0,
            y: 0,
            height: 0,
            width: 0,
          },
        }
        const payload = requestPayload('gallery')(cameraState, recordedVideo, croppedVideo)
        handleProcessedMedia([payload])
        autoKeyboardClose()
      }
    } catch (error) {
      handleError(error)
    }
  }

  /**
   * Handle camera video recording end
   * @param {boolean} shouldResetDuration
   */
  const handleVideoRecordEnd = (shouldResetDuration = true) => {
    if (!cameraRef.current) return
    cameraRef.current.stopRecording()
    clearInterval(recordIntervalRef.current)
    handleShutterButtonAnimation(1)
    if (shouldResetDuration)
      cameraState.setRecordedDuration(0)
  }

  /**
   * Animated the shutter button on video record start or end
   * @param {number} toVal
   * @returns
   */
  const handleShutterButtonAnimation = (toVal) => Animated.spring(shutterButtonScale, {
    toValue: toVal,
    duration: 80,
    useNativeDriver: true,
  }).start()

  return {
    handleCameraSnap,
    handleVideoRecord,
    handleVideoRecordEnd,
    shutterButtonScale,
    cameraRef,
    ...cameraState,
  }
}

export default useCamera
