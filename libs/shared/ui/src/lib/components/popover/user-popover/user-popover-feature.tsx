import { PropsWithChildren } from 'react'
import { UserPopover } from './user-popover'
import { UserPopoverProvider } from './user-popover-provider'

interface UserPopoverProps {
  userId?: string
  serverId?: string
  isNicknameEditable?: boolean
  className?: string
}

export function UserPopoverFeature({
  children,
  userId,
  serverId,
  isNicknameEditable,
  className,
}: PropsWithChildren<UserPopoverProps>) {
  return (
    <UserPopoverProvider
      userId={userId}
      serverId={serverId}
      isNicknameEditable={isNicknameEditable}
    >
      <UserPopover className={className}>{children}</UserPopover>
    </UserPopoverProvider>
  )
}
