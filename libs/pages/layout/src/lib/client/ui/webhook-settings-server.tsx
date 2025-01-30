import { ServerEntity } from '@beep/contracts'
import { useTranslation } from 'react-i18next'
import CreateWebhookFeature from '../feature/create-webhook-feature'
import WebhookListFeature from '../feature/webhook-list-feature'

export interface WebhookSettingsServerProps {
  server: ServerEntity
}

export default function WebHookSettingsServer({
  server,
}: WebhookSettingsServerProps) {
  const { t } = useTranslation()

  return (
    <div className="flex flex-col w-full bg-violet-200 p-4 overflow-y-auto gap-4 items-start">
      <div className=" text-slate-700 font-bold max-w-sm text-base sm:text-xl md:text-3xl">
        {t('layout.webhooks-settings-server.webhooks')}
      </div>

      <CreateWebhookFeature serverId={server.id} />
      <WebhookListFeature serverId={server.id} />
    </div>
  )
}
