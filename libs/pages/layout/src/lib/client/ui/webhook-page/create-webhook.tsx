import { ButtonIcon } from '@beep/ui'
import { useTranslation } from 'react-i18next'
import CreateWebhookModal from './create-webhook-modal'



export function CreateWebhook() {
  const { t } = useTranslation()
  return (
    <CreateWebhookModal>
      <ButtonIcon
        icon={'lucide:circle-plus'}
        className="bg-violet-400 px-2 xl:px-3 py-2 font-semibold w-fit"
        title={t('layout.webhooks-settings-server.new_webhook')}
        buttonProps={{ variant: 'hoverRounded' }}
        textHiddenResponsive
      />
    </CreateWebhookModal>
  )
}
