import { useState } from 'react'
import { ButtonNavigationList } from '../components/button-navigation-list'
import { SubSettings } from '../models/setting-navigation-models'

export interface SettingsUserModalProps {
  settings: SubSettings[]
}

export function SettingsModal({ settings }: SettingsUserModalProps) {
  const [selectedSetting, setSelectedSetting] = useState(
    settings[0].settings[0].title
  )
  return (
    <div className="flex flex-row">
      <div className="basis-1/6 bg-violet-300 flex flex-col h-[100dvh] pt-6 items-start divide-y-">
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
      <div className="basis-5/6 bg-violet-200 flex-col h-[100dvh]"></div>
    </div>
  )
}
