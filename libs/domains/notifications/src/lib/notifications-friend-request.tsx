// eslint-disable-next-line @nx/enforce-module-boundaries
import { upperCaseFirstLetter } from '@beep/transmit'
import { FriendRequestNotification } from './types'
import { useTranslation } from 'react-i18next'

export interface NotificationsFriendRequestProps {
  friendRequestNotification: FriendRequestNotification
}

export function NotificationsFriendRequest({
  friendRequestNotification,
}: NotificationsFriendRequestProps) {
  const { t } = useTranslation()
  return (
    <div>
      <strong>
        {upperCaseFirstLetter(friendRequestNotification.senderName)}
      </strong>
      {t('notifications.friend-request.request')}
    </div>
  )
}
