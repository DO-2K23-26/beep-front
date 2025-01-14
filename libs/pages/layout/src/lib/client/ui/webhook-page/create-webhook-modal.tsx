import { useGetServerChannelsQuery } from '@beep/server'
import {
  Button,
  ButtonStyle,
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  InputPicture,
  InputSelect,
  InputText,
} from '@beep/ui'
import { PropsWithChildren, useContext } from 'react'
import { Controller } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { CreateWebhookSettingsContext } from '../../feature/create-webhook-feature'

interface CreateWebhookModalProps {}

export default function CreateWebhookModal({
  children,
}: PropsWithChildren<CreateWebhookModalProps>) {
  const { t } = useTranslation()
  const { methodsAddWebhook, serverId, control, onCreateWebhook } = useContext(
    CreateWebhookSettingsContext
  )
  console.log('serverId', serverId)
  const { data: channelsResponse } = useGetServerChannelsQuery(serverId!)
  console.log(channelsResponse)

  const textChannelOptions =
    channelsResponse?.textChannels.map((channel) => ({
      value: channel.id,
      label: channel.name,
    })) || []

  return (
    <Dialog >
      <DialogTrigger>{children}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {t('layout.new-webhook-modal.create_modal.title')}
          </DialogTitle>
          <DialogDescription>
            {t('layout.new-webhook-modal.create_modal.subtitle')}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={onCreateWebhook} className="flex flex-col gap-4">
          <span className="flex items-center justify-center">
            <Controller
              name="profilePicture"
              control={control}
              render={({ field }) => (
                <InputPicture
                  value={field.value}
                  onChange={(e) => field.onChange(e.target.files[0])}
                  label={t('layout.add-server.create-server-modal.add_picture')}
                />
              )}
            />
          </span>
          <Controller
            name="name"
            rules={{
              required: t(
                'layout.new-webhook-modal.create_modal.name_required'
              ),
              minLength: {
                value: 1,
                message: t(
                  'layout.new-webhook-modal.create_modal.name_required'
                ),
              },
            }}
            control={control}
            render={({ field, fieldState: { error } }) => (
              <InputText
                label={t('layout.new-webhook-modal.create_modal.name_label')}
                type="text"
                name="name"
                value={field.value}
                onChange={field.onChange}
                error={error?.message}
              />
            )}
          />
          <Controller
            name="channelId"
            control={control}
            rules={{
              required: t(
                'layout.new-webhook-modal.create_modal.channel_required'
              ),
            }}
            render={({ field, fieldState: { error } }) => (
              <InputSelect
                label={t('layout.new-webhook-modal.create_modal.channel_label')}
                options={textChannelOptions}
                value={field.value}
                onChange={field.onChange}
                error={error?.message}
              />
            )}
          />
        </form>
        <DialogFooter>
          <DialogClose asChild>
            <Button className="btn--no-min-w" style={ButtonStyle.STROKED}>
              {t('layout.new-webhook-modal.create_modal.cancel')}
            </Button>
          </DialogClose>

          <Button
            className="btn--no-min-w"
            style={ButtonStyle.BASIC}
            onClick={onCreateWebhook}
          >
            {t('layout.new-webhook-modal.create_modal.create')}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
