import { PropsWithChildren } from 'react'
import { UserPopover } from './user-popover'
import { UserPopoverProvider } from './user-popover-provider'

interface UserPopoverProps {
  userId?: string
  serverId?: string
  className?: string
}

export function UserPopoverFeature({
  children,
  userId,
  serverId,
  className,
}: PropsWithChildren<UserPopoverProps>) {
  return (
    <UserPopoverProvider userId={userId} serverId={serverId}>
      <UserPopover className={className}>{children}</UserPopover>
    </UserPopoverProvider>
  )
}
