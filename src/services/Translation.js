import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import translationsJson from 'assets/translations.json'

/**
 * Translation library setup, appTranslation.data is an object of:
 * {
 *   en: { translation: { [key]: value, [key]: value } },
 *   de: { translation: { [key]: value, [key]: value } },
 * }
 */
const config = {
  resources: translationsJson,
  lng: 'en',
  fallbackLng: 'en',
}

i18n.use(initReactI18next).init(config)

export default i18n
