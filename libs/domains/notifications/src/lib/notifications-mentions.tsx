import { upperCaseFirstLetter } from '@beep/transmit'
import { UserMentionedInMessageNotification } from './notifications.slice'
import { useTranslation } from 'react-i18next'


export interface NotificationsMentionsProps {
  notification: UserMentionedInMessageNotification
}

export function NotificationsMentions({
  notification,
}: NotificationsMentionsProps) {
    const { t } = useTranslation()
  return (
    <div>
      <strong>
        {upperCaseFirstLetter(notification.serverName)} :{' '}
        {upperCaseFirstLetter(notification.channelName)}
      </strong>
      <div>
        {upperCaseFirstLetter(notification.senderName)}{' '}
        {t('notifications.mentions.mentioned')}
      </div>
    </div>
  )
}
