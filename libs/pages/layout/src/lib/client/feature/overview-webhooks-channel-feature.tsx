import { ChannelEntity, UpdateChannelRequest } from '@beep/contracts'
import { useUpdateChannelInServerMutation } from '@beep/server'
import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import { useTranslation } from 'react-i18next'
import { OverviewWebhooksChannel } from '../ui/overview-webhooks-channel'

interface OverviewWebhookChannelFeatureProps {
  channel: ChannelEntity
}

export default function OverviewWebhooksChannelFeature({
  channel,
}: Readonly<OverviewWebhookChannelFeatureProps>) {
  const { t } = useTranslation()
  const [updateChannel, result] = useUpdateChannelInServerMutation()

  useEffect(() => {
    if (result.isSuccess) {
      toast.success(
        t('layout.overview-settings-channel.success_update_channel')
      )
    } else if (result.isError) {
      toast.error(t('layout.overview-settings-channel.error_update_channel'))
    }
  }, [result])

  const form = useForm({
    mode: 'onChange',
    defaultValues: {
      channelName: channel.name,
      channelDescription: channel.description,
    },
  })

  const handleSave = form.handleSubmit((data) => {
    const updatedChannel: UpdateChannelRequest = {
      serverId: channel.serverId,
      channelId: channel.id,
      name: data.channelName,
      description: data.channelDescription,
    }
    updateChannel(updatedChannel)
  })

  const handleReset = () => {
    form.reset({
      channelName: channel.name,
      channelDescription: channel.description,
    })
  }

  return (
    <OverviewWebhooksChannel
      handleSave={handleSave}
      handleReset={handleReset}
      form={form}
    />
  )
}
