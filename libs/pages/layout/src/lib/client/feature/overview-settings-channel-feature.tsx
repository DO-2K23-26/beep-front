import { ChannelEntity, UpdateChannelRequest } from '@beep/contracts'
import { useUpdateChannelInServerMutation } from '@beep/server'
import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import { OverviewSettingsChannel } from '../ui/overview-settings-channel'


interface OverviewSettingsChannelFeatureProps {
  channel: ChannelEntity
}

export default function OverviewSettingsChannelFeature({
  channel,
}: Readonly<OverviewSettingsChannelFeatureProps>) {
  const [updateChannel, result] = useUpdateChannelInServerMutation()

  useEffect(() => {
    console.log('Channel updated successfully', result.data)
    if (result.isSuccess) {
      toast.success('Channel updated !')
    } else if (result.isError) {
      toast.error('An error occured while updating the channel !')
    }
  }, [result])

  const form = useForm({
    mode: 'onChange',
    defaultValues: {
      channelName: channel.name,
      channelDescription: channel.description,
    },
  });

  const handleSave = form.handleSubmit((data) => {
    const updatedChannel: UpdateChannelRequest = {
      serverId: channel.serverId,
      channelId: channel.id,
      name: data.channelName,
      description: data.channelDescription,
    };
    updateChannel(updatedChannel)
  });

  const handleReset = () => {
    form.reset({
      channelName: channel.name,
      channelDescription: channel.description,
    });
  };
  
  return (
    <OverviewSettingsChannel
      handleSave={handleSave}
      handleReset={handleReset}
      form={form}
    />
  )
}
