import { put, call, takeEvery, getContext } from 'redux-saga/effects'
import * as actions from 'store/ducks/auth/actions'
import * as constants from 'store/ducks/auth/constants'
import * as navigationActions from 'navigation/actions'
import * as NavigationService from 'services/Navigation'
import { authorize } from 'store/ducks/auth/saga/helpers'

function* handleAuthFlowRequest() {
  const AwsAuth = yield getContext('AwsAuth')
  const navigation = yield NavigationService.getNavigation()
  const currentCredentials = yield AwsAuth.currentCredentials()

  if (currentCredentials.authenticated) {
    yield call(authorize)
  } else {
    navigationActions.navigateAuthHome(navigation)
  }
}

function* authFlowRequest() {
  try {
    yield handleAuthFlowRequest()
    yield put(actions.authFlowSuccess())
  } catch (error) {
    yield put(actions.authFlowFailure(error))
  }
}

export default () => [takeEvery(constants.AUTH_FLOW_REQUEST, authFlowRequest)]
