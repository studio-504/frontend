import { Keyboard } from 'react-native'
import { getScreenAspectRatio } from 'services/Dimensions'

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
  width: getScreenAspectRatio(state.photoSize, snappedPhoto.width).x,
  height: getScreenAspectRatio(state.photoSize, snappedPhoto.width).y,
  includeExif: true,
  compressImageQuality: 1,
})

/**
 * graphql request object
 */
export const requestPayload = (type = 'gallery') => (state, snappedPhoto, croppedPhoto) => ({
  uri: (snappedPhoto.uri || snappedPhoto.path).replace('file://', ''),
  preview: (croppedPhoto.path || croppedPhoto.path).replace('file://', ''),
  originalFormat: snappedPhoto.extension || 'jpg',
  imageFormat: snappedPhoto.format || 'JPEG',
  crop: formatCropCoordinates(croppedPhoto.cropRect),
  originalMetadata: JSON.stringify(snappedPhoto.exif),
  takenInReal: type === 'camera',
  photoSize: state.photoSize,
})
