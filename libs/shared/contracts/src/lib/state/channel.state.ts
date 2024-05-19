import { ChannelEntity } from '../entities'

export interface ChannelsState {
  focusedChannel: ChannelEntity
  connected: boolean
}
