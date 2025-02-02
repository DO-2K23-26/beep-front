import {
  ChannelEntity,
  ChannelType,
  UserConnectedEntity,
} from '@beep/contracts'
import { memo, useContext, useRef } from 'react'
import { ChannelContext } from './channels-navigation-context'
import FolderChannel from '../ui/channels/folder-channel'
import { FolderProvider } from './folder-context'
import { SwappableItem, SwappableTrigger } from '@beep/transmit'
import { usePatchChannelPositionMutation } from '@beep/server'
import VoiceChannel from '../ui/voice-channel'
import DisplayChannelFeature from './display-channel-feature'

interface ListChannelsProps {
  channels: ChannelEntity[]
  parent?: string
}


// Component to render the appropriate channel type
const ChannelComponent = memo(function ChannelComponent({
  channel,
  occupiedChannel
}: {
  channel: ChannelEntity
  occupiedChannel?: { users: UserConnectedEntity[] }
}) {
  const { server } = useContext(ChannelContext)

  switch (channel.type) {
    case ChannelType.folder:
      return (
        <FolderProvider channel={channel} server={server}>
          <FolderChannel channel={channel} />
        </FolderProvider>
      )
    case ChannelType.voice_server:
      return (
        <SwappableTrigger>
          <VoiceChannel
            channel={channel}
            users={occupiedChannel?.users ?? []}
          />
        </SwappableTrigger>
      )
    default:
      return <SwappableTrigger>
        <DisplayChannelFeature channel={channel} />
      </SwappableTrigger>
  }
}, (prevProps, nextProps) => {
  if(prevProps.channel.type !== nextProps.channel.type) {
    return false
  }
  if(prevProps.channel.childrens && nextProps.channel.childrens) {
    if(prevProps.channel.childrens.length !== nextProps.channel.childrens.length) {
      return false
    }
  }
  if(prevProps.channel.parentId && nextProps.channel.parentId) {
    if(prevProps.channel.parentId !== nextProps.channel.parentId) {
      return false
    }
  }

  if(prevProps.channel.position !== nextProps.channel.position) {
    return false
  }
  return prevProps.channel.id !== nextProps.channel.id
})

// Hook to manage drag and drop functionality

export function ListChannels({
  channels,
  parent
}: ListChannelsProps) {
  const [moveChannel] = usePatchChannelPositionMutation()
  const { streamingUsers: occupiedChannels, server } = useContext(ChannelContext)

  const renderChannel = (channel: ChannelEntity, index: number) => {
    const occupiedChannel = occupiedChannels.find(
      occupied => occupied.channelId === channel.id
    )

    const channelComponent = (
      <SwappableItem slot={`${parent}-${index}`} item={channel.id}>
        <ChannelComponent
          channel={channel}
          occupiedChannel={occupiedChannel}
        />
      </SwappableItem>
    )

    return (
      channelComponent
    )
  }

  return (
    //<SwapProvider handleSwapStart={(event) => {
    //  return
    //}} handleSwapEnd={(event) => {
    //  event.slotItemMap.asArray.forEach(({ slot, item }) => {
    //    const splitted =  slot.split('-')
    //    const newPosition = parseInt(splitted[splitted.length - 1]) // extract the position from the slot
    //    moveChannel({
    //      position: newPosition,
    //      channelId: item,
    //      serverId: server.id ?? '',
    //    })
    //  })
    //  return
    //}}>
      channels.map((channel, index) => renderChannel(channel, index))
    //</SwapProvider>
  )
}
