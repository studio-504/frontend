const generateAssetFormat = (extension) => {
	if (extension && extension.toUpperCase().includes('HEIC')) {
		return 'HEIC'
	}
	return `JPEG`
}

export const getAssetFileAbsolutePath = (selectedPhoto) => {
  const extension = selectedPhoto.filename.split('?')[0].split('#')[0].split('.').pop()
  const format = generateAssetFormat(extension)

  return {
		format,
		extension,
		path: selectedPhoto.fileSource,
		filename: selectedPhoto.filename,
  }
}

export const generateCroppedCoordinates = (cropRect) => ({
  lowerRight: { x: cropRect.x + cropRect.width, y: cropRect.y + cropRect.height },
  upperLeft: { x: cropRect.x, y: cropRect.y },
})