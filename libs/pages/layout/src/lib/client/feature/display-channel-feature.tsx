import { ChannelEntity } from '@beep/contracts'
import DisplayChannel from '../ui/display-channel'
import { toast } from 'react-hot-toast'
import { useNavigate } from 'react-router-dom'

interface DisplayChannelFeature {
  channel: ChannelEntity
}

const onDeleteChannel = () => {
  console.log('Delete channel')
  toast.success('Channel deleted !')
}

export default function DisplayChannelFeature({ channel }: DisplayChannelFeature) {
  const navigate = useNavigate()

  const onJoinChannel = (channelId: string) => {
    navigate(`/channels/${channelId}`)
  }

  return (
    <DisplayChannel
      channel={channel}
      onJoinChannel={onJoinChannel}
      onDeleteChannel={onDeleteChannel}
    />
  )
}
