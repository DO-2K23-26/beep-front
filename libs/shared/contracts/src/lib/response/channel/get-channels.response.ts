import { ChannelEntity } from "../../entities";

export interface GetChannelsResponse {
  voiceChannels: ChannelEntity[]
  textChannels: ChannelEntity[]
}
