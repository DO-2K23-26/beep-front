// eslint-disable-next-line @nx/enforce-module-boundaries
import { upperCaseFirstLetter } from '@beep/transmit'
import { FriendMessageNotification } from './types'
import { useTranslation } from 'react-i18next'

export interface NotificationsFriendMessageProps {
  friendMessageNotification: FriendMessageNotification
}

export function NotificationsFriendMessage({
  friendMessageNotification,
}: NotificationsFriendMessageProps) {
  const { t } = useTranslation()
  return (
    <div>
      <strong>
        {upperCaseFirstLetter(friendMessageNotification.senderName)}
      </strong>
      {t('notifications.friend-message.message')}
    </div>
  )
}
