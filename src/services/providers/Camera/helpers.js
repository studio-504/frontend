import { Keyboard } from 'react-native'
import * as Logger from 'services/Logger'
import { getScreenAspectRatio } from 'services/Dimensions'

export const handleError = error => {
  if (error.code !== 'E_PICKER_CANCELLED') {
    Logger.captureException(error)
  }
}

/**
 * Formatting crop coordinates to match graphql supported format
 */
const formatCropCoordinates = (cropRect) => ({
  lowerRight: { x: cropRect.x + cropRect.width, y: cropRect.y + cropRect.height },
  upperLeft: { x: cropRect.x, y: cropRect.y },
})

/**
 * We use it for prevent open keyboard after crop
 * https://github.com/ivpusic/react-native-image-crop-picker/issues/1273
 */
export const autoKeyboardClose = () => {
  Keyboard.dismiss()
}

/**
 * react-native-image-crop-picker request object
 */
export const cropperOptions = (state, snappedPhoto) => ({
  avoidEmptySpaceAroundImage: false,
  path: snappedPhoto.path || snappedPhoto.uri,
  width: getScreenAspectRatio(state.mediaSize, snappedPhoto.width).x,
  height: getScreenAspectRatio(state.mediaSize, snappedPhoto.width).y,
  includeExif: true,
  compressImageQuality: 1,
})

/**
 * graphql request object
 */
const originalMetadata = snappedPhoto => ({
  ...snappedPhoto.exif,
  creationDate: snappedPhoto.creationDate,
  modificationDate: snappedPhoto.modificationDate,
  adjustmentData: snappedPhoto.adjustmentData,
})

export const requestPayload = (type = 'gallery') => (state, snappedPhoto, croppedPhoto) => ({
  uri: (snappedPhoto.uri || snappedPhoto.path).replace('file://', ''),
  preview: (croppedPhoto.path || croppedPhoto.path).replace('file://', ''),
  originalFormat: snappedPhoto.extension || 'jpg',
  imageFormat: snappedPhoto.format || 'JPEG',
  crop: formatCropCoordinates(croppedPhoto.cropRect),
  originalMetadata: JSON.stringify(originalMetadata(snappedPhoto)),
  takenInReal: type === 'camera',
  mediaSize: state.mediaSize,
})

/**
 *
 * @param {string} originalFormat
 * @returns VIDEO | IMAGE
 */
export const mediaType = (originalFormat) => {
  const images = ['jpg', 'jpeg', 'heic']
  if (images.includes(originalFormat))
    return 'IMAGE'

  const videos = ['mp4', 'mov']
  if (videos.includes(originalFormat))
    return 'VIDEO'

  throw new Error('Unsupported format')
}
