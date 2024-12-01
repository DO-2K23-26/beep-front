import { ChannelEntity, OccupiedChannelEntity } from '@beep/contracts'
import VoiceChannel from '../feature/voice-channel'

export interface ListVoiceChannelsProps {
	channels: ChannelEntity[]
	occupiedChannels: OccupiedChannelEntity[]
	onJoinChannel: (channel: ChannelEntity) => void
}
export function ListVoiceChannels({
    channels,
    occupiedChannels,
    onJoinChannel,
}: ListVoiceChannelsProps) {
    return (
        <>
        {channels.map((channel) => {
            const occupiedChannel = occupiedChannels.find((occupiedChannel) => {
                return occupiedChannel.channelId === channel.id
            })

            return (
                <VoiceChannel
                  key={channel.id}
                  channel={channel}
                  users={occupiedChannel ? occupiedChannel.users : []}
                  onJoinChannel={onJoinChannel}
                />
            )
        })}
        </>
    )

}
