import { ChannelEntity, ChannelType, Permissions } from '@beep/contracts'
import { SettingBodyWidth, SettingsModal, SubSettings } from '@beep/settings'
import { DialogCloseButton, Icon } from '@beep/ui'
import DeleteChannelFeature from '../feature/delete-channel-feature'
import OverviewSettingsChannelFeature from '../feature/overview-settings-channel-feature'
import { useTranslation } from 'react-i18next'
import { cn } from '@beep/utils'
import { ChannelContext } from '../feature/channels/channels-navigation-context'
import { useContext } from 'react'
// eslint-disable-next-line @nx/enforce-module-boundaries
import { ServerContext } from '@beep/pages/channels'

interface DisplayChannelProps {
  channel: ChannelEntity
  isSelected?: boolean
}

export default function DisplayChannel({
  channel,
  isSelected,
}: DisplayChannelProps) {
  const { t } = useTranslation()
  const { onJoinChannel } = useContext(ChannelContext)
  const { myMember } = useContext(ServerContext)
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
  const canManageChannel =
    !myMember || !myMember.hasPermission(Permissions.MANAGE_CHANNELS)
  return (
    <div
      className="flex flex-col group w-full"
      onClick={() => onJoinChannel && onJoinChannel(channel)}
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
        <div
          className={cn(
            'flex justify-center items-center invisible group-hover:visible',
            { hidden: canManageChannel }
          )}
        >
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
