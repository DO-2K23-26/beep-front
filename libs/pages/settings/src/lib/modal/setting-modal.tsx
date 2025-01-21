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
        if (setting.id === id) {
          return setting.settingComponent
        }
      }
    }
    return null
  }
  return (
    <div className="flex flex-row w-full h-dvh">
      <div className=" bg-violet-300 flex flex-col h-dvh px-2 sm:px-4 md:px-12 py-6 min-w-fit items-end">
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
      <div className="w-full px-2 bg-violet-200 flex flex-col items-center h-dvh">
        <div
          className={`flex flex-col px-2 w-full md:w-10/12 xl:w-8/12 h-full`}
        >
          {findSettingComponentById(settings, selectedSetting)}
        </div>
      </div>
    </div>
  )
}
