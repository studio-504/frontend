/**
 * Metro configuration for React Native
 * https://github.com/facebook/react-native
 *
 * @format
 */

/**
 * next 3 lines are required to mock some external libraries with .e2e.js extensions
 */
const defaultSourceExts = require('metro-config/src/defaults/defaults').sourceExts
const { RN_SRC_EXT } = process.env
const sourceExts = RN_SRC_EXT ? RN_SRC_EXT.split(',').concat(defaultSourceExts) : defaultSourceExts

module.exports = {
  transformer: {
    getTransformOptions: async () => ({
      transform: {
        experimentalImportSupport: false,
        inlineRequires: false,
      },
    }),
  },
  resolver: {
    sourceExts,
  },
}
