import { ChannelEntity } from '@beep/contracts'
import DisplayChannelFeature from '../feature/display-channel-feature'

export interface ListChannelsProps {
  channels: ChannelEntity[]
}

export function ListChannels({ channels }: ListChannelsProps) {
  return (
    <>
      {channels.map((channel) => (
        <DisplayChannelFeature key={channel.id} channel={channel} />
      ))}
    </>
  )
}
