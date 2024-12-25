import toast from 'react-hot-toast'
import { NotificationsFriendRequest } from './notifications-friend-request'
import { FriendRequestNotification, NOTIFICATION_TYPE, Notification, UserMentionedInMessageNotification } from './notifications.slice'
import { NotificationsMentions } from './notifications-mentions'

export interface NotificationsPopUpProps {
  notification: Notification
}

export function NotificationsPopUp({ notification }: NotificationsPopUpProps) {
  return toast(
    <div style={{ display: 'flex', alignItems: 'center' }}>
      {notification.type === NOTIFICATION_TYPE.USER_MENTIONED_IN_MESSAGE && (
        <NotificationsMentions notification={notification.payload as UserMentionedInMessageNotification} />
      )}
      {notification.type === NOTIFICATION_TYPE.FRIEND_REQUEST && (
        <NotificationsFriendRequest friendRequestNotification={notification.payload as FriendRequestNotification} />
      )}
    </div>,
    {
      icon: '🔔',
    }
  )
}
