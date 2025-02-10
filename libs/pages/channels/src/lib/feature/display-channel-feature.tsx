import { ChannelEntity } from '@beep/contracts'
import { useParams } from 'react-router'
import DisplayChannel from '../ui/display-channel'

interface DisplayChannelFeature {
  channel: ChannelEntity
}

export default function DisplayChannelFeature({
  channel,
}: DisplayChannelFeature) {
  const { channelId } = useParams<{ channelId: string }>()

  return (
        <DisplayChannel
          channel={channel}
          isSelected={channelId === channel.id}
        />
  )
}
