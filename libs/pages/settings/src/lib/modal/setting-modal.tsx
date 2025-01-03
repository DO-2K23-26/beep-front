import { ReactNode, useState } from 'react'
import { ButtonNavigationList } from '../components/button-navigation-list'
import { SubSettings } from '../models/setting-navigation-models'

export interface SettingsUserModalProps {
  settings: SubSettings[]
}

export function SettingsModal({ settings }: SettingsUserModalProps) {
  const [selectedSetting, setSelectedSetting] = useState(
    settings[0].settings[0].id
  )
  const findSettingComponentById = (
    subSettings: SubSettings[],
    id: string
  ): ReactNode | null => {
    for (const subSetting of subSettings) {
      for (const setting of subSetting.settings) {
        // pb: title change en fonction de la langue donc perdu et affiche une page blanche au lieu de rester sur la meme page
        if (setting.id === id) {
          return (
            <div
              className={`flex flex-col pt-12 px-2 w-full md:w-8/12 xl:w-6/12`}
            >
              {setting.settingComponent}
            </div>
          )
        }
      }
    }
    return null
  }
  return (
    <div className="flex flex-row w-full">
      <div className=" bg-violet-300 flex flex-col h-dvh px-2 sm:px-4 md:px-12 py-6 min-w-fit items-end overflow-y-auto">
        {settings.map((subSetting) => {
          return (
            <ButtonNavigationList
              key={subSetting.subGroupSettingTitle}
              subSettings={subSetting}
              selectedSetting={selectedSetting}
              setSelectedSetting={setSelectedSetting}
            />
          )
        })}
      </div>
      <div className="w-full px-2 bg-violet-200 flex flex-col items-center overflow-y-scroll scroll-smooth">
        {findSettingComponentById(settings, selectedSetting)}
      </div>
    </div>
  )
}
