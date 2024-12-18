import { ButtonIcon, ButtonShadCnProps, Skeleton } from '@beep/ui'

interface ChannelNameDisplayProps {
  channelName?: string
  isLoadingChannel: boolean
  hideName?: boolean
}

export function ChannelNameDisplay({
  channelName,
  isLoadingChannel,
  hideName,
}: ChannelNameDisplayProps) {
  const buttonProps: ButtonShadCnProps = {
    variant: 'hoverRounded',
    size: 'responsiveThick',
  }
  if (isLoadingChannel)
    return (
      <Skeleton className="h-10 sm:h-12 md:h-14 w-12 sm:w-16 md:w-24 rounded-xl bg-violet-300 transition-all" />
    )
  return (
    <ButtonIcon
      icon="lucide:hash"
      buttonProps={buttonProps}
      title={channelName}
      textClassName="max-w-16 sm:max-w-28 md:max-w-44 truncate"
      textHiddenResponsive={hideName}
    />
  )
}
