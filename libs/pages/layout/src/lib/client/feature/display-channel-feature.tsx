import { ChannelEntity } from '@beep/contracts'
import DisplayChannel from '../ui/display-channel'
import { toast } from 'react-hot-toast'

interface DisplayChannelFeature {
  channel: ChannelEntity
}

const onJoinChannel = () => {
  console.log('Join channel')
}

export default function DisplayChannelFeature({
  channel,
}: DisplayChannelFeature) {
  const onDeleteChannel = () => {
    console.log('Delete channel')
    toast.success('Channel deleted !')
  }
  return (
    <DisplayChannel
      channel={channel}
      onJoinChannel={onJoinChannel}
      onDeleteChannel={onDeleteChannel}
    />
  )
}
