import { ChannelEntity } from '@beep/contracts'
import { toast } from 'react-hot-toast'
import DisplayChannel from '../ui/display-channel'
import { useTranslation } from 'react-i18next'

interface DisplayChannelFeature {
  channel: ChannelEntity
  onJoinTextChannel: (serverId: string, channelId: string) => void
}

export default function DisplayChannelFeature({
  channel,
  onJoinTextChannel,
}: DisplayChannelFeature) {
  const { t } = useTranslation()

  const onDeleteChannel = () => {
    toast.success(t('layout.delete-channel.success_delete_channel'))
  }
  return (
    <DisplayChannel
      channel={channel}
      onJoinChannel={onJoinTextChannel}
      onDeleteChannel={onDeleteChannel}
    />
  )
}
