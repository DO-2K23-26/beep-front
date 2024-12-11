import React from 'react'

interface LanguageListProps {
  languages: { [key: string]: string }
  selectedLanguage: string
  onSelectLanguage: (languageCode: string) => void
}

const LanguageList: React.FC<LanguageListProps> = ({
  languages,
  selectedLanguage,
  onSelectLanguage,
}) => {
  return (
    <div className="language-list">
      <ul className="space-y-2 ">
        {Object.entries(languages).map(([code, label]) => (
          <li
            key={code}
            className={`flex items-center p-4 gap-4 rounded-lg cursor-pointer ${
              selectedLanguage === code ? 'bg-violet-300' : 'bg-violet-100'
            }`}
            onClick={() => onSelectLanguage(code)}
          >
            <input
              type="radio"
              name="language"
              checked={selectedLanguage === code}
              onChange={() => onSelectLanguage(code)}
              className=" cursor-pointer"
            />
            <label className="cursor-pointer">{label}</label>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default LanguageList
