import { SettingPickerButton } from '../buttons/setting-navigation-button'
import { SubSettings } from '../models/setting-navigation-models'

interface ButtonNavigationListProps {
  subSettings: SubSettings
  selectedSetting: string
  setSelectedSetting: (settingTitle: string) => void
}

export function ButtonNavigationList({
  subSettings,
  selectedSetting,
  setSelectedSetting,
}: ButtonNavigationListProps) {
  return (
    <div className="flex flex-col items-center container pb-4 gap-1">
      <p className="font-semibold text-2xl">
        {subSettings.subGroupSettingTitle}
      </p>
      {subSettings.settings.map((setting) => {
        return (
          <SettingPickerButton
            key={setting.title}
            title={setting.title}
            navigateTo={function (): void {
              setSelectedSetting(setting.title)
            }}
            isPicked={selectedSetting === setting.title}
          />
        )
      })}
    </div>
  )
}
