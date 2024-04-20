import { ChannelEntity, ChannelType } from '@beep/contracts'
import { Icon } from '@beep/ui'

interface DisplayChannelProps {
  channel: ChannelEntity
  onJoinChannel?: () => void
  onParameters?: () => void
}

export default function DisplayChannel({
  channel,
  onJoinChannel,
  onParameters,
}: DisplayChannelProps) {
  return (
    <div className="flex flex-col group w-full" onClick={onJoinChannel}>
      <div className="flex flex-row justify-between items-center w-full px-3 py-2 hover:bg-violet-400 cursor-pointer rounded-xl">
        <div className="flex flex-row justify-center items-center gap-2">
          {channel.type === ChannelType.VOICE ? (
            <Icon name="lucide:volume-2" className="w-4 h-4" />
          ) : (
            <Icon name="lucide:hash" className="w-4 h-4" />
          )}
          <p className="font-semibold max-w-[150px] truncate">{channel.name}</p>
        </div>
        <div className="flex justify-center items-center invisible group-hover:visible">
          <button onClick={onParameters}>
            <Icon name="lucide:settings" className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  )
}
