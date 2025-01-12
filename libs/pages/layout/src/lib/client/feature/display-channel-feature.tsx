import { ChannelEntity } from '@beep/contracts'
import DisplayChannel from '../ui/display-channel'
import { useParams } from 'react-router'

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
