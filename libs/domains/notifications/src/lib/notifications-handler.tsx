import toast from 'react-hot-toast'
import {
  FriendMessageNotification,
  NOTIFICATION_TYPE,
  Notification,
} from './types'
import { useEffect } from 'react'
// eslint-disable-next-line @nx/enforce-module-boundaries
import { TransmitSingleton } from '@beep/transmit'
import { NotificationsGeneric } from './notifications-generic'
import { useParams } from 'react-router'
export interface NotificationsHandlerProps {
  userInfo:
    | {
        audited_account: boolean
        sub: string
        exp: number
        resource_access: {
          roles: string[]
        }
        username: string
        firstName: string
        lastName: string
        email: string
      }
    | undefined
}

export function NotificationsHandler({ userInfo }: NotificationsHandlerProps) {
  const { channelId } = useParams()

  useEffect(() => {
    if (!userInfo) return
    // test if the user is already subscribed to the channel
    TransmitSingleton.subscribe(
      'notifications/users/' + userInfo.sub,
      (data) => {
        const notification: Notification = JSON.parse((data as any).event)
        // don't show a toast if the user is already on the channel
        if (
          notification.type !== NOTIFICATION_TYPE.FRIEND_MESSAGE ||
          (notification.payload as FriendMessageNotification).channelId !==
            channelId
        ) {
          toast(<NotificationsGeneric notification={notification} />, {
            icon: '🔔',
          })
        }
      }
    )
  }, [userInfo, channelId])

  return null // this component doesn't render anything
}
