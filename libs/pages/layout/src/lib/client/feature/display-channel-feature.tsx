import { ChannelEntity } from '@beep/contracts'
import DisplayChannel from '../ui/display-channel'

interface DisplayChannelFeature {
  channel: ChannelEntity
}

const onJoinChannel = () => {
  console.log('Join channel')
}

const onDeleteChannel = () => {
  console.log('Delete channel')
}

export default function DisplayChannelFeature({
  channel,
}: DisplayChannelFeature) {
  return (
    <DisplayChannel
      channel={channel}
      onJoinChannel={onJoinChannel}
      onDeleteChannel={onDeleteChannel}
    />
  )
}
