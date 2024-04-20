import { ChannelType } from "../enums/channel-type"

export interface ChannelEntity {
    id: string
    name: string
    server_id: string | null
    type: ChannelType
    created_at?: string
    updated_at?: string
}