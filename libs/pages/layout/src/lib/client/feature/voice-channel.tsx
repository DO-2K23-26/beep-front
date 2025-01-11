import { ChannelEntity, UserConnectedEntity } from '@beep/contracts'
import DisplayChannel from '../ui/display-channel'
import { ListConnectedUsers } from '../ui/list-connected-user'

interface VoiceChannelProps {
  channel: ChannelEntity
  users: UserConnectedEntity[]
  position: number,
  onJoinChannel: (channel: ChannelEntity) => void
}

export default function VoiceChannel({
  channel,
  users,
  position,
  onJoinChannel,
}: VoiceChannelProps) {
  const onJoin = () => {
    onJoinChannel(channel)
  }

  return (
    <div data-swapy-slot={position}>
      <div data-swapy-item={channel.id}>
        <DisplayChannel channel={channel} onJoinChannel={onJoin} />
        <ListConnectedUsers users={users} />
      </div>
    </div>
  )
}
