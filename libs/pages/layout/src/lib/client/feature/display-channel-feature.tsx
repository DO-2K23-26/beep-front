import { ChannelEntity } from '@beep/contracts'
import { toast } from 'react-hot-toast'
import DisplayChannel from '../ui/display-channel'

interface DisplayChannelFeature {
  channel: ChannelEntity
  onJoinTextChannel: (serverId: string, channelId: string) => void
}

const onDeleteChannel = () => {
  toast.success('Channel deleted !')
}

export default function DisplayChannelFeature({
  channel,
  onJoinTextChannel,
}: DisplayChannelFeature) {
  return (
    <DisplayChannel
      channel={channel}
      onJoinChannel={onJoinTextChannel}
      onDeleteChannel={onDeleteChannel}
    />
  )
}
