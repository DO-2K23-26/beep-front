import { ChannelEntity } from '@beep/contracts'
import DisplayChannel from '../ui/display-channel'

interface DisplayChannelFeature {
  channel: ChannelEntity
}

const onJoinChannel = () => {
  console.log('Join channel')
}

const onParameters = () => {
  console.log('Modal parameters')
}

export default function DisplayChannelFeature({
  channel,
}: DisplayChannelFeature) {
  return (
    <DisplayChannel
      channel={channel}
      onJoinChannel={onJoinChannel}
      onParameters={onParameters}
    />
  )
}
