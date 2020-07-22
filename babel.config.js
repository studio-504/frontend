module.exports = {
  presets: [
    'module:metro-react-native-babel-preset'
  ],
  plugins: [
    ['module-resolver', {
      root: ['./src'],
      alias: {
        appconfig: './config.js',
      }
    }],
    ['optional-require', {
      blacklist: ['react-native-vector-icons'],
    }],
  ],
}
