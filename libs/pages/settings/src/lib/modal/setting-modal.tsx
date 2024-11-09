import { ReactNode, useState } from 'react'
import { ButtonNavigationList } from '../components/button-navigation-list'
import { SubSettings } from '../models/setting-navigation-models'

export interface SettingsUserModalProps {
  settings: SubSettings[]
}

export function SettingsModal({ settings }: SettingsUserModalProps) {
  const [selectedSetting, setSelectedSetting] = useState(
    settings[0].settings[0].title
  )
  const findSettingComponentByTitle = (
    subSettings: SubSettings[],
    title: string
  ): ReactNode | null => {
    for (const subSetting of subSettings) {
      for (const setting of subSetting.settings) {
        if (setting.title === title) {
          return (
            <div className={`flex flex-col pt-12 w-10/12 md:w-8/12 xl:w-6/12 `}>
              {setting.settingComponent}
            </div>
          )
        }
      }
    }
    return null
  }
  return (
    <div className="flex flex-row">
      <div className=" bg-violet-300 flex flex-col h-dvh p-4 md:p-12 min-w-fit items-end  overflow-y-auto">
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
      <div className="w-full bg-violet-200 flex flex-col items-center">
        {findSettingComponentByTitle(settings, selectedSetting)}
      </div>
    </div>
  )
}
