import {
  ChannelEntity,
  ChannelType,
  OccupiedChannelEntity,
} from '@beep/contracts'
import DisplayChannelFeature from '../feature/display-channel-feature'
import { Channel } from 'diagnostics_channel'
import VoiceChannel from '../feature/voice-channel'

export interface ListTextChannelsProps {
  channels: ChannelEntity[]
  onJoinTextChannel: (serverId: string, channelId: string) => void
  onJoinVoiceChannel: (channel: ChannelEntity) => void
  occupiedChannels: OccupiedChannelEntity[]
}

export function ListChannels({
  channels,
  onJoinTextChannel,
  onJoinVoiceChannel,
  occupiedChannels,
}: ListTextChannelsProps) {
  return (
    <>
      {channels.map((channel) => {
        const occupiedChannel = occupiedChannels.find((occupiedChannel) => {
          return occupiedChannel.channelId === channel.id
        })
        switch (channel.type) {
          case ChannelType.text_server:
            return (
              <DisplayChannelFeature
                key={channel.id}
                channel={channel}
                onJoinTextChannel={onJoinTextChannel}
              />
            )
          default:
            return (
              <VoiceChannel
                key={channel.id}
                channel={channel}
                users={occupiedChannel ? occupiedChannel.users : []}
                onJoinChannel={onJoinVoiceChannel}
              />
            )
        }
      })}
    </>
  )
}
