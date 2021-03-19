import { takeEvery } from 'redux-saga/effects'
import captureErrors from 'store/ducks/snackbars/captureErrors'
import captureSuccess from 'store/ducks/snackbars/captureSuccess'
import * as usersConstants from 'store/ducks/users/constants'

export default () => [
  takeEvery((action) => /FAILURE$/.test(action.type), captureErrors),
  takeEvery([usersConstants.USERS_EDIT_PROFILE_SUCCESS], captureSuccess),
]
