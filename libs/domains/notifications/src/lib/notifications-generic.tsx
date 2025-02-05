import { NotificationsFriendMessage } from "./notifications-friend-message"
import { NotificationsFriendRequest } from "./notifications-friend-request"
import { NotificationsMentions } from "./notifications-mentions"
import { Notification, NOTIFICATION_TYPE, UserMentionedInMessageNotification, FriendRequestNotification, FriendMessageNotification } from "./types"

export interface NotificationsGenericProps {
  notification: Notification
}

export function NotificationsGeneric({ notification }: NotificationsGenericProps) {
  return (
    <div style={{ display: 'flex', alignItems: 'center' }}>
      {notification.type === NOTIFICATION_TYPE.USER_MENTIONED_IN_MESSAGE && (
        <NotificationsMentions
          notification={
            notification.payload as UserMentionedInMessageNotification
          }
        />
      )}
      {notification.type === NOTIFICATION_TYPE.FRIEND_REQUEST && (
        <NotificationsFriendRequest
          friendRequestNotification={
            notification.payload as FriendRequestNotification
          }
        />
      )}
      {notification.type === NOTIFICATION_TYPE.FRIEND_MESSAGE && (
        <NotificationsFriendMessage
          friendMessageNotification={
            notification.payload as FriendMessageNotification
          }
        />
      )}
    </div>
  )
}
