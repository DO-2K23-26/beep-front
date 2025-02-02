import { ChannelEntity, UserConnectedEntity } from '@beep/contracts'
import DisplayChannel from './display-channel'
import { ListConnectedUsers } from './list-connected-user'

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
