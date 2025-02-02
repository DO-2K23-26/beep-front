
import { ChannelEntity, ChannelType } from '@beep/contracts'
import { Icon } from '@beep/ui'
import { cn } from '@beep/utils'
import { ChannelContext } from '../../feature/channels/channels-navigation-context'
import { useContext } from 'react'
import ChannelSettings from './settings-channel'

interface DisplayChannelProps {
  channel: ChannelEntity
  isSelected?: boolean
}

// a leaf channel is a channel that is not a folder => so it is either a text channel or a voice channel
export default function LeafChannel({
  channel,
  isSelected,
}: DisplayChannelProps) {
  const { onJoinChannel } = useContext(ChannelContext);

  return (
    <div
      className="flex flex-col group w-full"
      onClick={() =>
        onJoinChannel ? onJoinChannel(channel) : {}
      }
    >
      <div
        className={cn(
          'flex flex-row justify-between items-center w-full px-3 py-2 hover:bg-violet-400/60 cursor-pointer rounded-xl',
          { 'bg-violet-400/60': isSelected }
        )}
      >
        <div className="flex flex-row justify-center items-center gap-2">
          {channel.type === ChannelType.voice_server ? (
            <Icon name="lucide:volume-2" className="w-4 h-4" />
          ) : (
            <Icon name="lucide:hash" className="w-4 h-4" />
          )}
          <p className="font-semibold max-w-10 md:max-w-36 truncate">
            {channel.name}
          </p>
        </div>
        <div className="flex justify-center items-center invisible group-hover:visible">
          <ChannelSettings channel={channel}/>
        </div>
      </div>
    </div>
  )
}
