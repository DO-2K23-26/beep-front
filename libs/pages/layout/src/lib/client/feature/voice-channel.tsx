import { ChannelEntity, UserConnectedEntity } from '@beep/contracts'
import DisplayChannel from '../ui/display-channel'
import { ListConnectedUsers } from '../ui/list-connected-user'

interface VoiceChannelProps {
  channel: ChannelEntity
  users: UserConnectedEntity[]
}

export default function VoiceChannel({
  channel,
  users,
}: VoiceChannelProps) {

  return (
    <>
      <DisplayChannel channel={channel} />
      <ListConnectedUsers users={users} />
    </>
  )
}
