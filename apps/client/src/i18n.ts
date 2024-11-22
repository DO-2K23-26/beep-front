import { initReactI18next } from 'react-i18next'
import i18n from 'i18next'
import en from "./translation/en.json"
import fr from "./translation/fr.json"

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
  .use(initReactI18next)
  .init({
    fallbackLng: 'en',
    lng: localStorage.getItem('i18nextLng') || 'en',
    defaultNS,
    resources,
  })


export default i18n
