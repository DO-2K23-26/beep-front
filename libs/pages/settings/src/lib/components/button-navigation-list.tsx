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
    <div className="flex flex-row shrink">
      <div className="flex flex-col items-start container pb-4 gap-1">
        <p className="font-semibold text-base sm:text-lg md:text-2xl">
          {subSettings.subGroupSettingTitle}
        </p>
        {subSettings.settings.map((setting) => {
          return (
            <SettingPickerButton
              key={setting.id}
              title={setting.title}
              navigateTo={function (): void {
                setSelectedSetting(setting.id)
              }}
              isPicked={selectedSetting === setting.id}
            />
          )
        })}
      </div>
    </div>
  )
}
