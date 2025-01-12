import { useCreateWebHookMutation } from '@beep/server' // Exemple de hook pour l'API
import { useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import toast from 'react-hot-toast'
import { useEffect } from 'react'
import NewWebhookModal from '../ui/new-webhook-modal'

export interface CreateWebhookForm {
  webhookName: string
  channelId: string
  serverId: string
  profilePicture: File
}

export interface CreateWebhookFeatureProps {
  closeModal: () => void
}

export default function CreateWebhookFeature({
  closeModal,
}: CreateWebhookFeatureProps) {
  const { t } = useTranslation()
  const { handleSubmit, control, setError } = useForm<CreateWebhookForm>()
  const [createWebhook, { isLoading, isSuccess, isError, error }] =
    useCreateWebHookMutation()

  const onSubmit = handleSubmit((data) => {
    createWebhook({
      name: data.webhookName,
      channelId: data.channelId,
      serverId: data.serverId,
      profilePicture: data.profilePicture,
    })
  })

  useEffect(() => {
    if (!isLoading && isSuccess) {
      toast.success(t('layout.new-webhook-modal.success_create'))
      closeModal()
    }
  }, [isLoading, isSuccess, closeModal, t])

  useEffect(() => {
    if (!isLoading && isError) {
      if (error && typeof error === 'object' && 'data' in error) {
        const { data } = error as any // Ajustez ici le type selon votre API
        if (data?.code === 'E_WEBHOOK_ALREADY_EXISTS') {
          setError('webhookName', {
            message: t('layout.new-webhook-modal.error_name_exists'),
            type: 'validate',
          })
        } else {
          toast.error(t('layout.new-webhook-modal.error_create'))
        }
      } else {
        console.error('Unexpected error structure:', error)
        toast.error(t('layout.new-webhook-modal.error_create'))
      }
    }
  }, [isLoading, isError, error, t, setError])

  return (
    <NewWebhookModal
      onSubmit={onSubmit}
      control={control}
      loading={isLoading}
      closeModal={closeModal}
    />
  )
}
