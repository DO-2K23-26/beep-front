import { ChannelEntity } from "../../entities/channel.entity"

export interface JoinVoiceChannelRequest {
    serverId: string
    channel: ChannelEntity
}