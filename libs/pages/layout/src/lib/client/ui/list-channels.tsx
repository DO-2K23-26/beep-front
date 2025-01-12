import {
  ChannelEntity,
  ChannelType,
} from '@beep/contracts'
import DisplayChannelFeature from '../feature/display-channel-feature'
import VoiceChannel from '../feature/voice-channel'
import { createSwapy, Swapy } from 'swapy'
import { useContext, useEffect, useRef } from 'react'
import {Swappable} from '@beep/utils'
import { ChannelContext } from '../feature/channels/channels-navigation-context'

export interface ListTextChannelsProps {
  moveChannel: (channelId: string, newPosition: number) => void
}

export function ListChannels({
  moveChannel,
}: ListTextChannelsProps) {
  const {streamingUsers: occupiedChannels, channels} = useContext(ChannelContext)
  const swapy = useRef<Swapy | null>(null)
  const container = useRef(null)
  const startingPosition = useRef<
    {
      slot: string
      item: string
    }[]
  >([])

  useEffect(() => {
    if (container.current) {
      swapy.current = createSwapy(container.current, {
        dragAxis: 'y',
      })

      swapy.current.onSwapStart((event) => {
        startingPosition.current = event.slotItemMap.asArray
      })

      swapy.current.onSwapEnd((event) => {
        if (event.hasChanged) {
          for (const { slot, item } of event.slotItemMap.asArray) {
            moveChannel(item, parseInt(slot))
          }
        }
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
              <Swappable slot={index.toString()} item={channel.id}>
                <DisplayChannelFeature
                  key={channel.id}
                  channel={channel}
                />
              </Swappable>
            )
          default:
            return (
              <Swappable slot={index.toString()} item={channel.id}>
                <VoiceChannel
                  key={channel.id}
                  channel={channel}
                  users={occupiedChannel ? occupiedChannel.users : []}
                />
              </Swappable>
            )
        }
      })}
    </div>
  )
}
