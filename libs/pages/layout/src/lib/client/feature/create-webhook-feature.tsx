import { useCreateWebHookMutation } from '@beep/server'
import { Control, useForm, UseFormReturn } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import toast from 'react-hot-toast'
import { createContext, useEffect } from 'react'
import { useParams } from 'react-router'
import { CreateWebhook } from '../ui/webhook-page/create-webhook'

export interface ICreateWebhookSettingsContext {
  serverId: string | undefined
  methodsAddWebhook: UseFormReturn<CreateWebhookForm>
  onCreateWebhook: () => void
  control: Control<CreateWebhookForm>
}

// Contexte pour les paramètres de création de webhook
export const CreateWebhookSettingsContext =
  createContext<ICreateWebhookSettingsContext>({
    serverId: undefined,
    methodsAddWebhook: {} as UseFormReturn<CreateWebhookForm>,
    onCreateWebhook: () => {},
    control: {} as Control<CreateWebhookForm>,
  })

export interface CreateWebhookForm {
  name: string
  channelId: string
  serverId: string
  profilePicture: File
}

interface CreateWebhookFeatureProps {
  serverId: string
}

export default function CreateWebhookFeature({
  serverId,
}: CreateWebhookFeatureProps) {
  const { t } = useTranslation()
  const [createWebhook, result] = useCreateWebHookMutation()

  // Initialisation du formulaire avec react-hook-form
  const methodsAddWebhook = useForm<CreateWebhookForm>({
    mode: 'onChange',
    defaultValues: {
      name: '',
      channelId: '',
      serverId: serverId || '',
      profilePicture: undefined,
    },
  })

  const onCreateWebhook = methodsAddWebhook.handleSubmit((data) => {
    console.log('Data sent to backend:', data)
    if (!data.serverId) {
      toast.error(t('layout.new-webhook-modal.error_missing_server'))
      return
    }
    createWebhook(data).then(() => {
      toast.success(t('layout.new-webhook-modal.success_create'))
      console.log('Webhook created')
    })
  })

  useEffect(() => {
    if (result.isError) {
      toast.error(t('layout.new-webhook-modal.error_create'))
    }
  }, [result, t])

  return (
    <CreateWebhookSettingsContext.Provider
      value={{
        serverId: serverId,
        control: methodsAddWebhook.control,
        onCreateWebhook: onCreateWebhook,
        methodsAddWebhook: methodsAddWebhook,
      }}
    >
      <CreateWebhook />
    </CreateWebhookSettingsContext.Provider>
  )
}
