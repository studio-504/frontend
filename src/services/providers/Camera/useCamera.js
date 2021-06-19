import { useRef, useState } from 'react'
import CropPicker from 'react-native-image-crop-picker'
import { useSelector } from 'react-redux'
import useToggle from 'react-use/lib/useToggle'
import * as postsSelector from 'store/ducks/posts/selectors'
import { autoKeyboardClose, cropperOptions, requestPayload, handleError } from 'services/providers/Camera/helpers'

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

  return {
    postsCreate,
    flashMode,
    handleFlashToggle,
    flipMode,
    handleFlipToggle,
    mediaSize,
    setMediaSize,
  }
}

const useCamera = ({ handleProcessedMedia = () => {} }) => {
  const cameraState = useCameraState()
  const cameraRef = useRef(null)

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
      const promise = cameraRef.current.recordAsync({})
      if (promise)
        console.log('recording')
      // cameraRef.current.pausePreview()
      // const snappedPhoto = await cameraRef.current.takePictureAsync(cameraOptions())
      // const croppedPhoto = await CropPicker.openCropper(cropperOptions(cameraState, snappedPhoto))
      // const payload = await requestPayload('camera')(cameraState, snappedPhoto, croppedPhoto)
      // handleProcessedMedia([payload])
      // cameraRef.current.resumePreview()
      // autoKeyboardClose()
    } catch (error) {
      handleError(error)
    }
  }

  return {
    handleCameraSnap,
    handleVideoRecord,
    cameraRef,
    ...cameraState,
  }
}

export default useCamera
