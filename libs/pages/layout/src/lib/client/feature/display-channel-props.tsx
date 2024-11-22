import { ChannelEntity } from '@beep/contracts'
import DisplayChannel from '../ui/display-channel'
import { toast } from 'react-hot-toast'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'

interface DisplayChannelProps {
  channel: ChannelEntity
  onJoinChannel: (channel: ChannelEntity) => void
  onDeleteChannel: (id: string) => void
}

export default function DisplayChannelProps({ channel }: DisplayChannelProps) {
  const navigate = useNavigate()
  const { t } = useTranslation()

  const onJoinChannel = (serverId: string, channelId: string) => {
    navigate(`/servers/${serverId}/channels/${channelId}`)
  }
  const onDeleteChannel = () => {
    toast.success(t('layout.delete-channel.success_delete_channel'))
  }

  return (
    <DisplayChannel
      channel={channel}
      onJoinChannel={onJoinChannel}
      onDeleteChannel={onDeleteChannel}
    />
  )
}
