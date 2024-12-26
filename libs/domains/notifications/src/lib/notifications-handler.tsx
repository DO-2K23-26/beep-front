import toast from 'react-hot-toast'
import { NotificationsFriendRequest } from './notifications-friend-request'
import {
  FriendRequestNotification,
  NOTIFICATION_TYPE,
  Notification,
  UserMentionedInMessageNotification,
} from './types'
import { NotificationsMentions } from './notifications-mentions'
import { useEffect } from 'react'
// eslint-disable-next-line @nx/enforce-module-boundaries
import { TransmitSingleton } from '@beep/transmit'

export interface NotificationsHandlerProps {
  userInfo: any
}

export function NotificationsHandler({ userInfo }: NotificationsHandlerProps) {
  useEffect(() => {
    if (!userInfo) return
    TransmitSingleton.subscribe(
      'notifications/users/' + userInfo.sub,
      (data) => {
        const notification: Notification = JSON.parse((data as any).event)
        toast(
          <div style={{ display: 'flex', alignItems: 'center' }}>
            {notification.type ===
              NOTIFICATION_TYPE.USER_MENTIONED_IN_MESSAGE && (
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
          </div>,
          {
            icon: '🔔',
          }
        )
      }
    )
  }, [userInfo])

  return null // this component doesn't render anything
}
