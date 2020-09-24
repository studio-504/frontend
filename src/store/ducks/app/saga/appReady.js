import { select, put, call, take, race, takeEvery } from 'redux-saga/effects'
import * as actions from 'store/ducks/app/actions'
import * as constants from 'store/ducks/app/constants'
import * as errors from 'store/ducks/app/errors'
import * as selectors from 'store/ducks/app/selectors'
import * as authSelectors from 'store/ducks/auth/selectors'

import * as themeActions from 'store/ducks/theme/actions'
import * as themeConstants from 'store/ducks/theme/constants'
import * as themeSelectors from 'store/ducks/theme/selectors'

import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import * as Updates from 'services/Updates'

/**
 * Translation library setup, appTranslation.data is an object of:
 * {
 *   en: { translation: { [key]: value, [key]: value } },
 *   de: { translation: { [key]: value, [key]: value } },
 * }
 */
function* translationInit() {
  const appTranslation = yield select(state => state.app.appTranslation)
  const languageCode = yield select(authSelectors.languageCodeSelector)

  const config = {
    resources: appTranslation.data,
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
function* appTranslationCached() {
  const appTranslationLength = yield select(selectors.appTranslationSelector)

  if (!appTranslationLength || !appTranslationLength.en) {
    return new Promise(() => {})
  }
}

function* handleAppReady() {
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
  yield put(actions.appTranslationRequest())
  yield race({
    appTranslationCached: call(appTranslationCached),
    appTranslationSuccess: take(constants.APP_TRANSLATION_SUCCESS),
    appTranslationFailure: take(constants.APP_TRANSLATION_FAILURE),
  })
  yield call(translationInit)
}

/**
 * Fetching assets such as language and translation
 */
function* appReadyRequest(req) {
  try {
    yield call(handleAppReady)
    const data = yield call(handleAppReady, req.payload)
    yield put(actions.appReadySuccess({
      message: errors.getMessagePayload(constants.AUTH_FLOW_SUCCESS, 'GENERIC'),
      data,
    }))

    /**
     * Is application at latest version
     */
    yield call([Updates, 'versionCheck'])
  } catch (error) {
    yield put(actions.appReadyFailure({
      message: errors.getMessagePayload(constants.AUTH_FLOW_FAILURE, 'GENERIC', error.message),
    }))
  }
}

export default () => [
  takeEvery(constants.APP_READY_REQUEST, appReadyRequest),
]