import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import LanguageList from '../components/language-list'

export function ChangeLanguageFeature() {
  const { i18n, t } = useTranslation()

  const availableLanguages: { [key: string]: string } = {
    en: 'English',
    fr: 'Français',
  }
  const [selectedLanguage, setSelectedLanguage] = useState(i18n.language)

  useEffect(() => {
    // The default web browser language can be a full language tag (e.g. en-US, fr-FR, etc...)
    setSelectedLanguage(i18n.language.split('-')[0].toLowerCase())
  }, [i18n.language])

  const handleLanguageChange = (languageCode: string) => {
    if (availableLanguages[languageCode]) {
      i18n.changeLanguage(languageCode)
      setSelectedLanguage(languageCode)
      localStorage.setItem('i18nextLng', languageCode)
    }
  }

  return (
    <div>
      <div className="text-base sm:text-xl md:text-3xl text-slate-700 font-bold mb-2 max-w-sm">
        {t('settings.change-language.language')}
      </div>
      <div className="p-4 min-h-screen">
        <LanguageList
          languages={availableLanguages}
          selectedLanguage={selectedLanguage}
          onSelectLanguage={handleLanguageChange}
        />
      </div>
    </div>
  )
}
