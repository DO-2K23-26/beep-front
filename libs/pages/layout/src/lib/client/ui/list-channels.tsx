import { ChannelEntity } from '@beep/contracts'
import DisplayChannelFeature from '../feature/display-channel-feature'

export interface ListTextChannelsProps {
  channels: ChannelEntity[]
}

export function ListTextChannels({ channels }: ListTextChannelsProps) {
  return (
    <>
      {channels.map((channel) => (
        <DisplayChannelFeature key={channel.id} channel={channel} />
      ))}
    </>
  )
}
