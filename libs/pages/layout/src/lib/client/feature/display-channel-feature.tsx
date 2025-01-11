import { ChannelEntity } from '@beep/contracts'
import DisplayChannel from '../ui/display-channel'
import { useParams } from 'react-router'

interface DisplayChannelFeature {
  channel: ChannelEntity
  onJoinChannel: (serverId: string, channelId: string) => void
}

export default function DisplayChannelFeature({
  channel,
  onJoinChannel,
}: DisplayChannelFeature) {
  const { channelId } = useParams<{ channelId: string }>()

  return (
        <DisplayChannel
          channel={channel}
          onJoinChannel={onJoinChannel}
          isSelected={channelId === channel.id}
        />
  )
}
