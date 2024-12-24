import {
  ChannelEntity,
  ChannelType,
  OccupiedChannelEntity,
} from '@beep/contracts'
import DisplayChannelFeature from '../feature/display-channel-feature'
import { Channel } from 'diagnostics_channel'
import VoiceChannel from '../feature/voice-channel'
import { createSwapy, Swapy } from 'swapy'
import { useEffect, useRef } from 'react'

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
  const swapy = useRef<Swapy | null>(null)
  const container = useRef(null)

  useEffect(() => {
    if (container.current) {
      swapy.current = createSwapy(container.current, {
        dragAxis: 'y',
      })
      swapy.current.onSwap((event) => {
        console.log('swap', event) // we will want to save the state
      })
    }

    return () => {
      swapy.current?.destroy()
    }
  })

  return (
    <div ref={container}>
      {channels.map((channel, index) => {
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
    </div>
  )
}
