import { WebhookEntity } from '@beep/contracts'
import { useGetWebHooksServerQuery } from '@beep/server'
import { useTranslation } from 'react-i18next'
import WebhookItemFeature from './webhook-item-feature'

interface WebhookListFeatureProps {
  serverId: string
}

export default function WebhookListFeature({
  serverId,
}: WebhookListFeatureProps) {
  const { t } = useTranslation()

  const {
    data: webhooks,
    isLoading,
    isError,
  } = useGetWebHooksServerQuery(serverId)

  if (isLoading) {
    return <div>{t('layout.webhook-list.loading')}</div>
  }

  if (isError) {
    return <div>{t('layout.webhook-list.error')}</div>
  }

  if (!webhooks || webhooks.length === 0) {
    return <div>{t('layout.webhook-list.no_webhooks')}</div>
  }

  if (webhooks.length === 0) {
    return <div>{t('layout.webhook-list.no_webhooks')}</div>
  } else {
    return (
      <ul>
        {webhooks?.map((webhook: WebhookEntity) => (
          <li key={webhook.id}>
            <WebhookItemFeature webhook={webhook}></WebhookItemFeature>
          </li>
        ))}
      </ul>
    )
  }
}
