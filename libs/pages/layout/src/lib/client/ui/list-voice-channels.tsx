import { ChannelEntity, OccupiedChannelEntity } from '@beep/contracts'
import VoiceChannelProps from '../feature/voice-channel-props'

export interface ListChannelsProps {
	channels: ChannelEntity[]
	occupiedChannels: OccupiedChannelEntity[]
	onJoinChannel: (channel: ChannelEntity) => void
	onDeleteChannel: (id: string) => void
}
export function ListChannels({
    channels,
    occupiedChannels,
    onJoinChannel,
    onDeleteChannel,
}: ListChannelsProps) {
    return (
        <>
        {channels.map((channel) => {
            const occupiedChannel = occupiedChannels.find((occupiedChannel) => {
                return occupiedChannel.channelId == channel.id
            })
            return (
                <VoiceChannelProps
                  key={channel.id}
                  channel={channel}
                  users={occupiedChannel ? occupiedChannel.users : []}
                  onJoinChannel={onJoinChannel}
                  onDeleteChannel={onDeleteChannel}
                />
            )
        })}
        </>
    )
      
}
