import { cn } from '@beep/transmit'
import { PropsWithChildren, useContext, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { Popover, PopoverContent, PopoverTrigger } from '../popover'
import { UserPopoverActionButton } from './user-popover-action-button'
import { UserPopoverContext } from './user-popover-provider'
import toast from 'react-hot-toast'

interface UserPopoverProps {
  userId?: string
  serverId?: string
  className?: string
}

export function UserPopover({
  children,
  className,
}: PropsWithChildren<UserPopoverProps>) {
  const { t } = useTranslation()
  const {
    goToPrivateConv,
    askFriend,
    displayedUser,
    member,
    myUser,
    friend,
    profilePicture,
    invitation,
    isSuccessAskFriend,
    isFailedAskFriend,
  } = useContext(UserPopoverContext)
  useEffect(() => {
    if (isSuccessAskFriend)
      toast.success(t('components.user-popover.success-ask-friend'))
    else if (isFailedAskFriend)
      toast.error(t('components.user-popover.failed-ask-friend'))
  }, [isFailedAskFriend, isSuccessAskFriend, t])

  return (
    <Popover>
      <PopoverTrigger>{children}</PopoverTrigger>
      <PopoverContent
        align="start"
        className={cn(
          'flex flex-row bg-violet-50 justify-between items-center',
          className
        )}
      >
        <div className="flex flex-row gap-4">
          <img
            src={profilePicture ?? '/picture.svg'}
            alt={displayedUser?.username ?? "User's profile picture"}
            className="aspect-square size-10 sm:size-12 md:size-16 rounded-lg hover:rounded-xl transition-all object-cover"
          />
          {member ? (
            <div className="flex flex-col">{member?.nickname}</div>
          ) : (
            <div className="flex flex-col">{displayedUser?.username}</div>
          )}
        </div>
        <UserPopoverActionButton
          askFriend={askFriend}
          goToPrivateConv={goToPrivateConv}
          displayAddFriend={!friend}
          displayInvitationSent={!!invitation}
          displayNone={myUser?.sub === displayedUser?.id}
        />
      </PopoverContent>
    </Popover>
  )
}
