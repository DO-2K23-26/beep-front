import { ChannelEntity } from '../../entities/channel.entity'

export interface JoinVoiceChannelRequest {
  serverId: string
  serverName: string
  channel: ChannelEntity
}
