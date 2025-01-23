import {
  useUpdateWebHookMutation,
  useDeleteWebHookMutation,
} from '@beep/server'
import { Control, useForm, UseFormReturn } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import toast from 'react-hot-toast'
import { createContext, useEffect } from 'react'
import WebhookItem from '../ui/webhook-page/webhook-item'
import { WebhookEntity } from '@beep/contracts'

export interface IWebhookItemSettingsContext {
  webhook: WebhookEntity
  methodsEditWebhook: UseFormReturn<UpdateWebhookForm>
  onUpdateWebhook: () => void
  onDeleteWebhook: () => void
  onCopyToken: () => void
  control: Control<UpdateWebhookForm>
}

export const WebhookItemSettingsContext =
  createContext<IWebhookItemSettingsContext>({
    webhook: {} as WebhookEntity,
    methodsEditWebhook: {} as UseFormReturn<UpdateWebhookForm>,
    onUpdateWebhook: () => {},
    onDeleteWebhook: () => {},
    onCopyToken: () => {},
    control: {} as Control<UpdateWebhookForm>,
  })

export interface UpdateWebhookForm {
  id: string
  name: string
}

interface WebhookItemFeatureProps {
  webhook: WebhookEntity
}

export default function WebhookItemFeature({
  webhook,
}: WebhookItemFeatureProps) {
  const { t } = useTranslation()
  const [updateWebhook, updateResult] = useUpdateWebHookMutation()
  const [deleteWebhook, deleteResult] = useDeleteWebHookMutation()

  const methodsEditWebhook = useForm<UpdateWebhookForm>({
    mode: 'onChange',
    defaultValues: {
      id: webhook.id,
      name: '',
    },
  })

  const onUpdateWebhook = methodsEditWebhook.handleSubmit((data) => {
    if (!webhook.id) {
      toast.error(t('layout.webhook-item.error_missing_webhook'))
      return
    }
    const updatedWebhook: Partial<WebhookEntity> = {
      id: webhook.id,
      serverId: webhook.serverId,
      channelId: webhook.channelId,
      name: data.name,
    }
    updateWebhook({
      webhookId: webhook.id,
      updatedWebhook,
    }).then(() => {
      toast.success(t('layout.webhook-item.success_update'))
    })
  })

  const onDeleteWebhook = () => {
    if (!webhook.id) {
      toast.error(t('layout.webhook-item.webhook_missing'))
      return
    }

    deleteWebhook({
      webhookId: webhook.id,
      serverId: webhook.serverId,
      channelId: webhook.channelId,
    }).then(() => {
      toast.success(t('layout.webhook-item.success_delete'))
    })
  }
 const onCopyToken = () => {
  if (webhook.token) {
    navigator.clipboard
      .writeText(webhook.token)
      .then(() => {
        toast.success(t('layout.webhook-item.copy_success')) 
      })
      .catch(() => {
        toast.error(t('layout.webhook-item.copy_error'))
      })
  } else {
    toast.error(t('layout.webhook-item.token_missing')) 
  }}
 

  useEffect(() => {
    if (updateResult.isError) {
      toast.error(t('layout.webhook-item.error_update'))
    }
  }, [updateResult, t])

  useEffect(() => {
    if (deleteResult.isError) {
      toast.error(t('layout.webhook-item.error_delete'))
    }
  }, [deleteResult, t])

  return (
    <WebhookItemSettingsContext.Provider
      value={{
        webhook: webhook,
        control: methodsEditWebhook.control,
        onUpdateWebhook: onUpdateWebhook,
        onDeleteWebhook: onDeleteWebhook,
        onCopyToken: onCopyToken,
        methodsEditWebhook: methodsEditWebhook,
      }}
    >
      <WebhookItem />
    </WebhookItemSettingsContext.Provider>
  )
}
