const webpack = require('webpack')
const path = require('path')
const dotenv = require('dotenv')
const packageJson = require('./package.json')

const appDirectory = path.resolve(__dirname, './')

// This is needed for webpack to compile JavaScript.
// Many OSS React Native packages are not compiled to ES5 before being
// published. If you depend on uncompiled packages they may cause webpack build
// errors. To fix this webpack can be configured to compile to the necessary
// `node_module`.
const babelLoaderConfiguration = {
  test: /\.(mjs|js|jsx)$/,
  type: 'javascript/auto',

  // Add every directory that needs to be compiled by Babel during the build.
  include: [
    path.resolve(appDirectory, 'node_modules/@react-native-community/viewpager'),
    path.resolve(appDirectory, 'node_modules/react-native-vector-icons'),
    path.resolve(appDirectory, 'node_modules/@aws-amplify/core'),
    path.resolve(appDirectory, 'node_modules/@aws-amplify/api'),
    path.resolve(appDirectory, 'node_modules/@aws-amplify/auth'),
    path.resolve(appDirectory, 'node_modules/@aws-amplify/pubsub'),
    path.resolve(appDirectory, 'node_modules/react-native-tab-view-viewpager-adapter'),
    path.resolve(appDirectory, 'node_modules/@sentry/react-native'),
    path.resolve(appDirectory, 'node_modules/@sentry/integrations'),
    path.resolve(appDirectory, 'node_modules/react-native-snap-carousel'),
    path.resolve(appDirectory, 'node_modules/react-native-phone-input'),
    path.resolve(appDirectory, 'node_modules/react-native-gesture-handler'),
    path.resolve(appDirectory, 'node_modules/react-native-reanimated'),
    path.resolve(appDirectory, 'App.js'),
    path.resolve(appDirectory, 'index.web.js'),
    path.resolve(appDirectory, 'src'),
  ],
  use: {
    loader: 'babel-loader',
  },
}

// This is needed for webpack to import static images in JavaScript files.
const imageLoaderConfiguration = {
  test: /\.(gif|jpe?g|png|svg)$/,
  use: {
    loader: 'url-loader',
    options: {
      name: '[name].[ext]',
    },
  },
}

module.exports = {
  mode: 'development',

  entry: [
    // load any web API polyfills
    // path.resolve(appDirectory, 'polyfills-web.js'),
    // your web-specific entry file
    path.resolve(appDirectory, 'index.web.js'),
  ],

  // configures where the build ends up
  output: {
    filename: 'bundle.web.js',
    path: path.resolve(appDirectory, 'dist'),
  },

  // ...the rest of your config

  module: {
    rules: [babelLoaderConfiguration, imageLoaderConfiguration],
  },

  devServer: {
    historyApiFallback: true,
  },

  plugins: [
    new webpack.DefinePlugin({
      process: {
        env: JSON.stringify({
          ...dotenv.config({ path: path.resolve(appDirectory, process.env.ENVFILE) }).parsed,
          version: packageJson.version,
        }),
      },
    }),
  ],

  resolve: {
    roots: [path.resolve(appDirectory, 'src')],

    mainFields: ['browser', 'main', 'module'],

    // This will only alias the exact import "react-native"
    alias: {
      'react-native$': 'react-native-web',
      'react-native-config': path.resolve(appDirectory, 'src/web/config'),
      'react-native-offline': path.resolve(appDirectory, 'src/web/react-native-offline'),
      'react-native-code-push': path.resolve(appDirectory, 'src/web/react-native-code-push'),
      'react-native-flash-message': path.resolve(appDirectory, 'src/web/react-native-flash-message'),
      'react-native-permissions': path.resolve(appDirectory, 'src/web/react-native-permissions'),
      '@sentry/react-native': '@sentry/react',
    },
    // If you're working on a multi-platform React Native app, web-specific
    // module implementations should be written in files using the extension
    // `.web.js`.
    extensions: ['.mjs', '.web.js', '.js', '.ios.js', '.android.js'],
  },
}
