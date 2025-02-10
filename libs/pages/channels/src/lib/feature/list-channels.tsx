import {
  ChannelEntity,
  ChannelType,
  UserConnectedEntity,
} from '@beep/contracts'
import { memo, useContext } from 'react'
import { ChannelContext } from './channels-navigation-context'
import FolderChannel from '../ui/channels/folder-channel'
import { FolderProvider } from './folder-context'
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
          <VoiceChannel
            channel={channel}
            users={occupiedChannel?.users ?? []}
          />
      )
    default:
      return <DisplayChannelFeature channel={channel} />
  }
}, (prevProps, nextProps) => {
  if (prevProps.channel.type !== nextProps.channel.type) {
    return false
  }
  if (prevProps.channel.childrens && nextProps.channel.childrens) {
    if (prevProps.channel.childrens.length !== nextProps.channel.childrens.length) {
      return false
    }
  }
  if (prevProps.channel.parentId && nextProps.channel.parentId) {
    if (prevProps.channel.parentId !== nextProps.channel.parentId) {
      return false
    }
  }

  if (prevProps.channel.position !== nextProps.channel.position) {
    return false
  }
  return prevProps.channel.id !== nextProps.channel.id
})

export function ListChannels({
  channels,
  parent
}: ListChannelsProps) {
  const { streamingUsers: occupiedChannels } = useContext(ChannelContext)

  const renderChannel = (channel: ChannelEntity, index: number) => {
    const occupiedChannel = occupiedChannels.find(
      occupied => occupied.channelId === channel.id
    )

    const channelComponent = (
        <ChannelComponent
          key={channel.id}
          channel={channel}
          occupiedChannel={occupiedChannel}
        />
    )

    return (
      channelComponent
    )
  }

  return (
        channels.map((channel, index) => renderChannel(channel, index))
  )
}
