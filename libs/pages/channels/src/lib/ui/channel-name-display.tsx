import { Icon, Skeleton } from '@beep/ui'

interface ChannelNameDisplayProps {
  channelName?: string
  isLoadingChannel: boolean
}

export function ChannelNameDisplay({
  channelName,
  isLoadingChannel,
}: ChannelNameDisplayProps) {
  if (isLoadingChannel)
    return <Skeleton className="h-14 w-24 rounded-xl bg-violet-300" />
  return (
    <div className="flex flex-row gap-2 items-center justify-center p-3 bg-violet-300 rounded-xl h-14">
      <Icon name="lucide:hash" className="w-4 h-4" />
      <p className="font-semibold">{channelName}</p>
    </div>
  )
}
