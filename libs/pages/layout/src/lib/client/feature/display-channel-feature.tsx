import { ChannelEntity } from '@beep/contracts'
import DisplayChannel from '../ui/display-channel'
import { useParams } from 'react-router'

interface DisplayChannelFeature {
  channel: ChannelEntity
  onJoinTextChannel: (serverId: string, channelId: string) => void
}

export default function DisplayChannelFeature({
  channel,
  onJoinTextChannel,
}: DisplayChannelFeature) {
  const { channelId } = useParams<{ channelId: string }>()

  return (
    <div data-swapy-slot={channel.id}>
      <div data-swapy-item={channel.id}>
        <DisplayChannel
          channel={channel}
          onJoinChannel={onJoinTextChannel}
          isSelected={channelId === channel.id}
        />
      </div>
    </div>
  )
}
