import { select, put, call, take, race, takeEvery } from 'redux-saga/effects'
import * as actions from 'store/ducks/auth/actions'
import * as constants from 'store/ducks/auth/constants'
import * as errors from 'store/ducks/auth/errors'
import * as selectors from 'store/ducks/auth/selectors'

import * as themeActions from 'store/ducks/theme/actions'
import * as themeConstants from 'store/ducks/theme/constants'
import * as translationActions from 'store/ducks/translation/actions'
import * as translationConstants from 'store/ducks/translation/constants'

import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'

/**
 * Translation library setup, translationFetch.data is an object of:
 * {
 *   en: { translation: { [key]: value, [key]: value } },
 *   de: { translation: { [key]: value, [key]: value } },
 * }
 */
function* translationsInit() {
  const translationFetch = yield select(state => state.translation.translationFetch)
  const languageCode = yield select(selectors.languageCodeSelector)

  const config = {
    resources: translationFetch.data,
    lng: languageCode || 'en',
    fallbackLng: 'en',
  }
  i18n.use(initReactI18next).init(config)
} 

function* handleAuthReadyRequest() {
  /**
   * Asseets load from cloudflare
   * Add offline cache
   */
  yield put(themeActions.themeFetchRequest())
  yield race({
    themeFetchSuccess: take(themeConstants.THEME_FETCH_SUCCESS),
    themeFetchFailure: take(themeConstants.THEME_FETCH_FAILURE),
  })

  /**
   * Translation validation
   */
  yield put(translationActions.translationFetchRequest())
  yield race({
    translationFetchSuccess: take(translationConstants.TRANSLATION_FETCH_SUCCESS),
    translationFetchFailure: take(translationConstants.TRANSLATION_FETCH_FAILURE),
  })
  yield call(translationsInit)
}

/**
 * Fetching assets such as language and translation
 */
function* authReadyRequest(req) {
  try {
    yield call(handleAuthReadyRequest)
    const data = yield call(handleAuthReadyRequest, req.payload)
    yield put(actions.authReadySuccess({
      message: errors.getMessagePayload(constants.AUTH_FLOW_SUCCESS, 'GENERIC'),
      data,
    }))
  } catch (error) {
    yield put(actions.authReadyFailure({
      message: errors.getMessagePayload(constants.AUTH_FLOW_FAILURE, 'GENERIC', error.message),
    }))
  }
}

export default () => [
  takeEvery(constants.AUTH_READY_REQUEST, authReadyRequest),
]