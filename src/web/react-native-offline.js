/**
 * Mock 'react-native-offline' for web
 * check webpack.config.js
 */

export const reducer = () => null
export const ReduxNetworkProvider = ({ children }) => children
export const createNetworkMiddleware = () => () => (next) => (action) => next(action)
