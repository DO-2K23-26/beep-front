import { ChannelEntity } from '@beep/contracts'
import DisplayChannel from '../ui/display-channel'
import { toast } from 'react-hot-toast'
import { channelsActions } from '@beep/channel'
import { useDispatch } from 'react-redux'
import { AppDispatch } from '@beep/store'

interface DisplayChannelFeature {
  channel: ChannelEntity
}


export default function DisplayChannelFeature({
  channel,
}: DisplayChannelFeature) {
  const dispatch = useDispatch<AppDispatch>()

  const onJoinChannel = () => {
    dispatch(channelsActions.setCurrentChannel(channel))
  }

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
