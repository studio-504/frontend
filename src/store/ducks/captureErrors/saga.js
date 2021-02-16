import { takeEvery, call } from 'redux-saga/effects'

function* captureErrors(action) {
  yield call([console, 'log'], action)
}

export default () => [takeEvery((action) => /FAILURE$/.test(action.type), captureErrors)]

// import * as Logger from 'services/Logger'
// import path from 'ramda/src/path'

// const captureErrors = (action) => {
//   const nativeError = path(['payload', 'message', 'nativeError'])(action)

//   Logger.withScope(scope => {
//     scope.setExtra('action', JSON.stringify(action))

//     if (nativeError === 'string') {
//       Logger.captureMessage(nativeError)
//     } else {
//       Logger.captureException(path(['payload'])(action))
//     }
//   })
// }
