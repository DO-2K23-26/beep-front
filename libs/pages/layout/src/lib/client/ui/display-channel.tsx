import { ChannelEntity, ChannelType } from '@beep/contracts'
import { SettingBodyWidth, SettingsModal, SubSettings } from '@beep/settings'
import { DialogCloseButton, Icon } from '@beep/ui'
import DeleteChannelFeature from '../feature/delete-channel-feature'
import OverviewSettingsChannelFeature from '../feature/overview-settings-channel-feature'
import { useTranslation } from 'react-i18next'
import { cn } from '@beep/utils'

interface DisplayChannelProps {
  channel: ChannelEntity
  onJoinChannel?: (serverId: string, channelId: string) => void
  isSelected?: boolean
}

export default function DisplayChannel({
  channel,
  onJoinChannel,
  isSelected,
}: DisplayChannelProps) {
  const { t } = useTranslation()

  // List of setting in the user setting modal
  const subSetting: SubSettings = {
    subGroupSettingTitle: t('layout.display-channel.channel'),
    settings: [
      {
        title: t('layout.display-channel.overview'),
        id: 'overview',
        settingComponent: <OverviewSettingsChannelFeature channel={channel} />,
        settingBodySize: SettingBodyWidth.S,
      },
      {
        title: t('layout.display-channel.delete'),
        id: 'delete',
        settingComponent: <DeleteChannelFeature channel={channel} />,
      },
    ],
  }

  return (
    <div
      className="flex flex-col group w-full"
      onClick={() =>
        onJoinChannel ? onJoinChannel(channel.serverId, channel.id) : {}
      }
    >
      <div
        className={cn(
          'flex flex-row justify-between items-center w-full px-3 py-2 hover:bg-violet-400/60 cursor-pointer rounded-xl',
          { 'bg-violet-400/60': isSelected }
        )}
      >
        <div className="flex flex-row justify-center items-center gap-2">
          {channel.type === ChannelType.voice_server ? (
            <Icon name="lucide:volume-2" className="w-4 h-4" />
          ) : (
            <Icon name="lucide:hash" className="w-4 h-4" />
          )}
          <p className="font-semibold max-w-10 md:max-w-36 truncate">
            {channel.name}
          </p>
        </div>
        <div className="flex justify-center items-center invisible group-hover:visible">
          <DialogCloseButton
            content={<SettingsModal settings={[subSetting]} />}
          >
            <Icon name="lucide:settings" className="!w-4 !h-4" />
          </DialogCloseButton>
        </div>
      </div>
    </div>
  )
}
