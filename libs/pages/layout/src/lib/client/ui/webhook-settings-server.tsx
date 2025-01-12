import { ServerEntity } from '@beep/contracts'
import {
  Button,
  ButtonStyle,
  InputText,
  InputImageSettings,
  ButtonIcon,
} from '@beep/ui'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import CreateWebhookModal from './new-webhook-modal'
import { CreateWebhookForm } from '../feature/new-webhook-modal-feature'
import { useForm } from 'react-hook-form'

 interface WebhookSettingsServerProps {
  server: ServerEntity
}

export function WebHookSettingsServer({ server }: WebhookSettingsServerProps) {
  const { t } = useTranslation()

  const [serverName, setServerName] = useState(server.name)

  const [isModalOpen, setIsModalOpen] = useState(false)
  const { control, handleSubmit, reset } = useForm<CreateWebhookForm>()
  const [loading, setLoading] = useState(false)

  const handleSaveWebhook = (webhook: any) => {
    console.log('Webhook créé :', webhook)
    setIsModalOpen(false)
  }

  return (
    <div className="flex flex-col w-full bg-violet-200 p-4 overflow-y-auto gap-4">
      <div className=" text-slate-700 font-bold max-w-sm text-base sm:text-xl md:text-3xl">
        {t('layout.webhooks-settings-server.webhooks')}
      </div>
      {isModalOpen && (
        <CreateWebhookModal
          onSubmit={handleSubmit(handleSaveWebhook)} // Soumettre les données
          control={control}
          loading={loading}
          closeModal={() => setIsModalOpen(false)} // Fermer le modal
        />
      )}
      <ButtonIcon
        icon={'lucide:circle-plus'}
        className="bg-violet-400 px-2 xl:px-3 py-2 font-semibold"
        onClick={() => setIsModalOpen(true)} // Ouvre la modale
        title={t('layout.webhooks-settings-server.new_webhook')}
        buttonProps={{ variant: 'hoverRounded' }}
        textHiddenResponsive
      />

      {/* List of webhooks */}
    </div>
  )
}
