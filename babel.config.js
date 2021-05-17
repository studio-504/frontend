module.exports = {
  presets: ['module:metro-react-native-babel-preset'],
  plugins: [
    'react-native-web',
    'react-native-paper/babel',
    [
      'transform-require-extensions',
      {
        extensions: {
          '.mjs': '',
        },
      },
    ],
    'inline-dotenv',
    [
      'module-resolver',
      {
        root: ['./src'],
        extensions: ['.mjs', '.jsx', '.js'],
      },
    ],
    [
      'optional-require',
      {
        blacklist: ['react-native-vector-icons'],
      },
    ],
    [
      'babel-plugin-transform-builtin-extend',
      {
        globals: ['Error'],
      },
    ],
  ],
}
