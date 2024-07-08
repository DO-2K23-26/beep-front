import { ChannelEntity } from '@beep/contracts'
import DisplayChannel from '../ui/display-channel'
import { toast } from 'react-hot-toast'
import { useNavigate } from 'react-router-dom'

interface DisplayChannelProps {
    channel: ChannelEntity
    onJoinChannel: (channel: ChannelEntity) => void
    onDeleteChannel: (id: string) => void
}

const onDeleteChannel = () => {
    toast.success('Channel deleted !')
  }

  export default function DisplayChannelProps({ channel }: DisplayChannelProps) {
    const navigate = useNavigate()

    const onJoinChannel = (serverId: string, channelId: string) => {
      navigate(`/servers/${serverId}/channels/${channelId}`)
    }

    return (
      <DisplayChannel
        channel={channel}
        onJoinChannel={onJoinChannel}
        onDeleteChannel={onDeleteChannel}
      />
    )
  }
