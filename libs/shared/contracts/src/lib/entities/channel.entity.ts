import { ChannelType } from "../enums/channel-type"

export interface ChannelEntity {
    id: string
    name: string
    serverId: string
    type: ChannelType
    createdAt?: string
    updatedAt?: string
}