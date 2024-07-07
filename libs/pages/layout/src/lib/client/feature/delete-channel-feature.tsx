import { DeleteChannelRequest } from '@beep/contracts'
import { ChannelEntity } from '@beep/contracts'
import { useDeleteChannelInServerMutation } from '@beep/server'
import { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import { DeleteChannel } from '../ui/delete-channel'
import { useNavigate } from 'react-router'

interface DeleteChannelFeatureProps {
    channel: ChannelEntity
}


export default function DeleteChannelFeature({
  channel,
}: DeleteChannelFeatureProps) {
  const [confirmation, setConfirmation] = useState('')
  const [error, setError] = useState<string | undefined>(undefined)
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const [deleteChannel] = useDeleteChannelInServerMutation()

  const onSubmit = () => {
    setLoading(true)
    if (confirmation !== channel.name) {
      setError('Confirmation text does not match')
      setLoading(false)
      return
    }

    const deletedChannel: DeleteChannelRequest = {
      serverId: channel.serverId,
      channelId: channel.id,
    }
    deleteChannel(deletedChannel)
      .unwrap()
      .then(() => {
        setLoading(false)
        toast.success('Channel deleted successfully')
        navigate(`/servers/${channel.serverId}`)
      })
      .catch((err) => {
        setError('An error occured while deleting the channel')
        setLoading(false)
        toast.error('An error occured while deleting the channel')
      })
  }

  return (
    <DeleteChannel
      channelName={channel.name}
      confirmationText={confirmation}  // Text to confirm the deletion of the channel. Must equal its name
      onChange={(event) => {  // Function to handle the change of the confirmation text
        setConfirmation(event.target.value)
        setError(undefined)
      }}
      onSubmit={onSubmit}  // Function to handle the deletion of the channel
      error={error}  // Error message to display if the confirmation text does not match the channel name
      loading={loading}  // Boolean to indicate if the deletion is in progress (affects the Delete button)
    />
  )
}
