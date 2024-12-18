import { ChannelEntity } from '@beep/contracts'
import { PrivateChannelFeature } from '../feature/private-channel-feature'
import { LoadingPrivateChannel } from './loading-private-channels'

interface DisplayPrivateChannelsProps {
  channels?: ChannelEntity[]
  isLoading?: boolean
}

export function DisplayPrivateChannels({
  channels,
  isLoading,
}: DisplayPrivateChannelsProps) {
  if (isLoading || !channels)
    return (
      <div className="flex flex-col w-full gap-2 py-3 px-1">
        {[...Array(3)].map((_, index) => (
          <LoadingPrivateChannel key={"loading_private_channel" + index} />
        ))}
      </div>
    )

  return (
    <div className="flex flex-col w-full gap-2 sm:gap-4 md:gap-6 py-3 sm:py-4 overflow-y-auto scroll-smooth no-scrollbar max-w-24 sm:max-w-48 md:max-w-72">
      {channels.map((channel) => (
        <PrivateChannelFeature key={channel.id} channel={channel} />
      ))}
    </div>
  )
}
