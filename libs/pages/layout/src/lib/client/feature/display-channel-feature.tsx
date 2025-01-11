import { ChannelEntity } from '@beep/contracts'
import DisplayChannel from '../ui/display-channel'
import { useParams } from 'react-router'

interface DisplayChannelFeature {
  channel: ChannelEntity
  position: number,
  onJoinTextChannel: (serverId: string, channelId: string) => void
}

export default function DisplayChannelFeature({
  channel,
  onJoinTextChannel,
  position
}: DisplayChannelFeature) {
  const { channelId } = useParams<{ channelId: string }>()

  return (
    <div data-swapy-slot={position}>
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
