import { ChannelEntity, ChannelType } from '@beep/contracts'
import { SettingBodyWidth, SettingsModal, SubSettings } from '@beep/settings'
import {
  DialogCloseButton,
  Icon,
  useModal
} from '@beep/ui'
import OverviewSettingsChannelFeature from '../feature/overview-settings-channel-feature'
import DeleteChannelFeature from '../feature/delete-channel-feature'

interface DisplayChannelProps {
  channel: ChannelEntity
  onJoinChannel?: (serverId: string, channelId: string) => void
  onDeleteChannel?: () => void
}

export default function DisplayChannel({
  channel,
  onJoinChannel,
  onDeleteChannel,
}: DisplayChannelProps) {
  // List of setting in the user setting modal
  const subSetting: SubSettings = {
    subGroupSettingTitle: 'Channel',
    settings: [
      {
        title: 'Overview',
        settingComponent: (
          <OverviewSettingsChannelFeature channel={channel} />
        ),
        settingBodySize: SettingBodyWidth.S,
      },
      {
        title: 'Delete',
        settingComponent: (
          <DeleteChannelFeature channel={channel} />
        ),
      },
    ],
  }

  return (
    <div className="flex flex-col group w-full" onClick={() => onJoinChannel ? onJoinChannel(channel.serverId, channel.id) : {}}>
      <div className="flex flex-row justify-between items-center w-full px-3 py-2 hover:bg-violet-400 cursor-pointer rounded-xl">
        <div className="flex flex-row justify-center items-center gap-2">
          {channel.type === ChannelType.VOICE ? (
            <Icon name="lucide:volume-2" className="w-4 h-4" />
          ) : (
            <Icon name="lucide:hash" className="w-4 h-4" />
          )}
          <p className="font-semibold max-w-[150px] truncate">{channel.name}</p>
        </div>
        <div className="flex justify-center items-center invisible group-hover:visible">
        <DialogCloseButton
          triggerButton={<Icon name="lucide:settings" className="!w-4 !h-4" />}
          content={<SettingsModal settings={[subSetting]} />}
        />
        </div>
      </div>
    </div>
  )
}
