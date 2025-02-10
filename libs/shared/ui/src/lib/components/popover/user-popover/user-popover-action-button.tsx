import { useTranslation } from 'react-i18next'
import { ButtonIcon } from '../../button/button-icon'
import { TooltipPopover } from './tooltip-popover'
import { Icon } from '@iconify/react'

interface UserPopoverActionButtonProps {
  askFriend?: () => void
  goToPrivateConv?: () => void
  displayNone?: boolean
  displayAddFriend?: boolean
  displayInvitationSent?: boolean
}

export function UserPopoverActionButton({
  askFriend,
  goToPrivateConv,
  displayNone,
  displayAddFriend,
  displayInvitationSent,
}: UserPopoverActionButtonProps) {
  const { t } = useTranslation()
  // myUser?.sub !== displayedUser?.id
  if (displayNone) return
  
  if (displayInvitationSent)
    return (
      <TooltipPopover content={t('components.user-popover.invitation-sent')}>
        <div className=" flex items-center justify-center rounded-full size-10 bg-violet-300">
          <Icon icon="lucide:user-check"/>
        </div>
      </TooltipPopover>
    )

  // friend === undefined
  if (displayAddFriend)
    return (
      <TooltipPopover content={t('components.user-popover.add-friend')}>
        <ButtonIcon
          buttonProps={{ variant: 'ghost' }}
          icon="lucide:user-plus"
          className="rounded-full w-10 h-10"
          onClick={askFriend}
        />
      </TooltipPopover>
    )
  else
    return (
      <TooltipPopover content={t('components.user-popover.private-conv')}>
        <ButtonIcon
          buttonProps={{ variant: 'ghost' }}
          icon="lucide:message-circle"
          className="rounded-full w-10 h-10"
          onClick={goToPrivateConv}
        />
      </TooltipPopover>
    )
}
