import { initReactI18next } from 'react-i18next'
import i18n from 'i18next'
import en from './translation/en.json'
import fr from './translation/fr.json'
import I18nextBrowserLanguageDetector from 'i18next-browser-languagedetector'

export const defaultNS = 'ns'
export const resources = {
  en: {
    ns: en,
  },
  fr: {
    ns: fr,
  },
} as const

i18n
  .use(I18nextBrowserLanguageDetector)
  .use(initReactI18next)
  .init({
    fallbackLng: 'en',
    detection: {
      order: ['localStorage', 'navigator'],
      caches: ['localStorage'],
    },
    defaultNS,
    resources,
  })

export default i18n
