const image = {
  path: '/Users/danieldarko/Downloads/sample1.heic',
  sourceURL: 'file:///Users/danieldarko/Downloads/sample1.heic',
  fileSource: '/Users/danieldarko/Downloads/sample1.heic',
  adjustmentData: false,
  creationDate: '1626774899',
  cropRect: null,
  data: null,
  duration: null,
  filename: 'sample1.HEIC',
  localIdentifier: 'AD12015B-8829-4AC1-BEE7-3BAFCB33EC5B/L0/001',
  mime: 'image/heic',
  modificationDate: '1626774900',
  size: 293608,
  width: 1440,
  height: 960,
  exif: {
    ColorModel: 'RGB',
    Depth: 8,
    Orientation: 1,
    PixelHeight: 960,
    PixelWidth: 1440,
    PrimaryImage: true,
    ProfileName: 'sRGB IEC61966-2.1',
  },
}

const openPicker = () => ([image])

const openCropper = () => ({ ...image, ...{
  cropRect: {
    height: 959,
    width: 720,
    x: 360,
    y: 0,
  },
} })

export default {
  openPicker,
  openCropper,
}
