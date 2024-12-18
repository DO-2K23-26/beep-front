import { useFetchPinnedMessagesQuery } from '@beep/channel'
import {
  ButtonIcon,
  ButtonShadCnProps,
  Popover,
  PopoverTrigger,
  PopoverContent,
  Skeleton,
} from '@beep/ui'
import { useTranslation } from 'react-i18next'
import PinnedMessagesList from './pinned-messages-list'
import { MemberEntity } from '@beep/contracts'

interface DisplayPinnedProps {
  channelId: string
  serverId?: string
  isLoading?: boolean
  usersServer?: MemberEntity[]
}

export function DisplayPinned({
  channelId,
  serverId,
  isLoading,
  usersServer,
}: DisplayPinnedProps) {
  const buttonProps: ButtonShadCnProps = {
    size: 'responsiveThick',
    variant: 'hoverRounded',
  }
  const { t } = useTranslation()
  const { data: pinnedMessage, isLoading: isLoadingPinned } =
    useFetchPinnedMessagesQuery(
      {
        channelId,
      },
      { skip: channelId === '' }
    )
  if (isLoading)
    return (
      <Skeleton className="h-10 sm:h-12 md:h-14 w-12 sm:w-16 md:w-24 rounded-xl bg-violet-300 transition-all" />
    )
  return (
    <Popover>
      <PopoverTrigger asChild>
        <div>
          <ButtonIcon
            icon="lucide:pin"
            title={t('channels.display-pinned.pinned_messages')}
            buttonProps={buttonProps}
            textHiddenResponsive
          />
        </div>
      </PopoverTrigger>

      {!isLoadingPinned && pinnedMessage !== undefined && (
        <PopoverContent align="start" className="border-none p-0">
          <PinnedMessagesList
            messages={pinnedMessage}
            serverId={serverId}
            usersServer={usersServer}
          />
        </PopoverContent>
      )}
    </Popover>
  )
}


