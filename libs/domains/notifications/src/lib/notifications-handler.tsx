import toast from 'react-hot-toast'
import {
  Notification,
} from './types'
import { useEffect } from 'react'
// eslint-disable-next-line @nx/enforce-module-boundaries
import { TransmitSingleton } from '@beep/transmit'
import { NotificationsGeneric } from './notifications-generic'

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
  useEffect(() => {
    if (!userInfo) return
    TransmitSingleton.subscribe(
      'notifications/users/' + userInfo.sub,
      (data) => {
        const notification: Notification = JSON.parse((data as any).event)
        toast(
          <NotificationsGeneric notification={notification} />,
          {
            icon: '🔔',
          }
        )
      }
    )
  }, [userInfo])

  return null // this component doesn't render anything
}
