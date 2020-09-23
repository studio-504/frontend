import { select, put, call, take, race, takeEvery } from 'redux-saga/effects'
import * as actions from 'store/ducks/auth/actions'
import * as constants from 'store/ducks/auth/constants'
import * as errors from 'store/ducks/auth/errors'
import * as selectors from 'store/ducks/auth/selectors'

import * as themeActions from 'store/ducks/theme/actions'
import * as themeConstants from 'store/ducks/theme/constants'
import * as themeSelectors from 'store/ducks/theme/selectors'
import * as translationActions from 'store/ducks/translation/actions'
import * as translationConstants from 'store/ducks/translation/constants'
import * as translationSelectors from 'store/ducks/translation/selectors'

import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import * as Updates from 'services/Updates'

/**
 * Translation library setup, translationFetch.data is an object of:
 * {
 *   en: { translation: { [key]: value, [key]: value } },
 *   de: { translation: { [key]: value, [key]: value } },
 * }
 */
function* translationInit() {
  const translationFetch = yield select(state => state.translation.translationFetch)
  const languageCode = yield select(selectors.languageCodeSelector)

  const config = {
    resources: translationFetch.data,
    lng: languageCode || 'en',
    fallbackLng: 'en',
  }
  i18n.use(initReactI18next).init(config)
}

/**
 * Check if themes are already loaded
 */
function* themeFetchCached() {
  const themeFetchLength = yield select(themeSelectors.themeFetchSelector)

  if (!themeFetchLength || !themeFetchLength.length) {
    return new Promise(() => {})
  }
}

/**
 * Check if translations are already loaded
 */
function* translationFetchCached() {
  const translationFetchLength = yield select(translationSelectors.translationFetchSelector)

  if (!translationFetchLength || !translationFetchLength.en) {
    return new Promise(() => {})
  }
}

function* handleAuthReadyRequest() {
  /**
   * Asseets load from cloudflare
   * Add offline cache
   */
  yield put(themeActions.themeFetchRequest())
  yield race({
    themeFetchCached: call(themeFetchCached),
    themeFetchSuccess: take(themeConstants.THEME_FETCH_SUCCESS),
    themeFetchFailure: take(themeConstants.THEME_FETCH_FAILURE),
  })

  /**
   * Translation validation
   */
  yield put(translationActions.translationFetchRequest())
  yield race({
    translationFetchCached: call(translationFetchCached),
    translationFetchSuccess: take(translationConstants.TRANSLATION_FETCH_SUCCESS),
    translationFetchFailure: take(translationConstants.TRANSLATION_FETCH_FAILURE),
  })
  yield call(translationInit)
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

    /**
     * Is application at latest version
     */
    yield call([Updates, 'versionCheck'])
  } catch (error) {
    yield put(actions.authReadyFailure({
      message: errors.getMessagePayload(constants.AUTH_FLOW_FAILURE, 'GENERIC', error.message),
    }))
  }
}

export default () => [
  takeEvery(constants.AUTH_READY_REQUEST, authReadyRequest),
]