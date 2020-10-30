import equals from 'ramda/src/equals'
import { eventChannel } from 'redux-saga'
import { call, takeEvery, put } from 'redux-saga/effects'
import * as usersActions from 'store/ducks/users/actions'
import * as NavigationService from 'services/Navigation'

function createNavigationChannel(navigation) {
  let prevRoute = navigation.getCurrentRoute()

  return eventChannel((emitter) => {
    return navigation.addListener('state', () => {
      const route = navigation.getCurrentRoute()
      const isChanged = !equals(prevRoute, route)

      if (isChanged) {
        emitter(route)
        prevRoute = route
      }
    })
  })
}

function* navigationSubscription() {
  try {
    const navigation = yield NavigationService.getNavigation()
    const channel = yield call(createNavigationChannel, navigation)

    yield takeEvery(channel, function* (route) {
      yield put(usersActions.usersReportScreenViewsRequest({ screens: [route.name] }))
    })
  } catch (error) {
    // ignore
  }
}

export default navigationSubscription
