import { ChannelEntity } from '@beep/contracts'
import DisplayChannelFeature from '../feature/display-channel-feature'

export interface ListTextChannelsProps {
  channels: ChannelEntity[]
  onJoinTextChannel: (serverId: string, channelId: string) => void
}

export function ListTextChannels({
  channels,
  onJoinTextChannel,
}: ListTextChannelsProps) {
  return (
    <>
      {channels.map((channel) => (
        <DisplayChannelFeature
          key={channel.id}
          channel={channel}
          onJoinTextChannel={onJoinTextChannel}
        />
      ))}
    </>
  )
}
