<<<<<<< HEAD
import { ReactNode, useState } from 'react'
import { ButtonNavigationList } from '../components/button-navigation-list'
=======
import { ModifyProfileCard } from '@beep/settings'
import { useState } from 'react'
>>>>>>> 0f2ba20 (feat(settings):init lib)
import { SubSettings } from '../models/setting-navigation-models'
import { ButtonNavigationList } from '../components/button-navigation-list'
import { ModifyProfileCardFeature } from '../feature/modify-profile-card-feature'

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
          return setting.settingComponent
        }
      }
    }
    return null
  }
  return (
    <div className="flex flex-row">
      <div className="basis-1/6 bg-violet-300 flex flex-col h-[100dvh] pt-12 px-12  divide-y-1 items-end  overflow-y-auto">
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
      <div className="basis-5/6 bg-violet-200 flex-col h-[100dvh]">
        {/* affichage des paramatres */}
        {
          settings
            .find((subSetting) =>
              subSetting.settings.find(
                (setting) => setting.title === selectedSetting
              )
            )
            ?.settings.find((setting) => setting.title === selectedSetting)
            ?.settingComponent
        }
      </div>
    </div>
  )
}
