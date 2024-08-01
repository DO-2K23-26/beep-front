import { ChannelEntity, UserConnectedEntity } from '@beep/contracts'
import DisplayChannel from '../ui/display-channel'
import { ListConnectedUsers } from '../ui/list-connected-user'


interface VoiceChannelProps {
	channel: ChannelEntity
	users: UserConnectedEntity[]
	onJoinChannel: (channel: ChannelEntity) => void
	onDeleteChannel: (id: string) => void
}

export default function VoiceChannel({ channel, users, onJoinChannel, onDeleteChannel }: VoiceChannelProps) {
    const onJoin = () => {
        onJoinChannel(channel)
    }

    const onDelete = () => {
        onDeleteChannel(channel.id)
    }

    return (
        <div>
            <DisplayChannel channel={channel} onJoinChannel={onJoin} onDeleteChannel={onDelete} />
            <ListConnectedUsers users={users} />
        </div>
    )
}
