import {
  useGetChannelQuery,
  useTransmitWebhookPictureQuery,
} from '@beep/server'
import {
  ButtonIcon,
  InputImageSettings,
  InputText,
} from '@beep/ui'
import { useContext, useState } from 'react'
import { Controller } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { WebhookItemSettingsContext } from '../../feature/webhook-item-feature'

export default function WebhookItem() {
  const { t } = useTranslation()
  const {
    methodsEditWebhook,
    webhook,
    control,
    onDeleteWebhook,
    onUpdateWebhook,
    onCopyToken,
  } = useContext(WebhookItemSettingsContext)
  const [webhookName, setWebhookName] = useState(webhook.name)

  const channelName = useGetChannelQuery({
    serverId: webhook.serverId,
    channelId: webhook.channelId,
  }).data?.name

  console.log("channel name", channelName)

  const { data: icon } = useTransmitWebhookPictureQuery({
    webhookId: webhook.id,
    serverId: webhook.serverId,
    channelId: webhook.channelId,
  })

  return (
    <div className="flex items-center gap-4 p-4 rounded-md m-4 bg-violet-50 w-full">
      <div className=" rounded-md flex items-center justify-center">
        <InputImageSettings
          type="webhookpicture"
          label={t('layout.webhook-item.upload_picture')}
          name="webhook"
          serverId={webhook.serverId}
          initialImage={icon}
        />
      </div>
      <div className="flex-1">
        {/* Formulaire */}
        <form onSubmit={onUpdateWebhook} className="flex flex-col gap-4">
          <div className="flex flex-col">
            <Controller
              name="name"
              rules={{
                required: t('layout.webhook-item.name_required'),
                minLength: {
                  value: 1,
                  message: t('layout.webhook-item.name_required'),
                },
              }}
              control={control}
              render={({ field, fieldState: { error } }) => (
                <InputText
                  label={t('layout.webhook-item.name_label')}
                  type="text"
                  name="name"
                  value={webhookName}
                  onChange={field.onChange}
                  error={error?.message}
                />
              )}
            />

            <div className="flex flex-col">
              <p className="text-gray-800 bg-white px-2 py-1 my-4 rounded-md border border-gray-300 shadow-sm">
                {channelName}
              </p>
            </div>
          </div>
        </form>
        {/* Boutons */}
        <div className="flex justify-start items-center gap-4 mt-4">
          <ButtonIcon
            onClick={onCopyToken}
            className="btn--no-min-w"
            title={t('layout.webhook-item.copy_webhook')}
          ></ButtonIcon>
          <ButtonIcon
            onClick={onDeleteWebhook}
            buttonProps={{ variant: 'ghost' }}
            className=" hover:underline bg-transparent"
            textClassName="text-red-500"
            title={t('layout.webhook-item.delete_webhook')}
          ></ButtonIcon>
          <ButtonIcon
            className="btn--no-min-w"
            icon="lucide:save"
            onClick={onUpdateWebhook}
            title={t('layout.webhook-item.save')}
          ></ButtonIcon>
        </div>
      </div>
    </div>
  )
}
