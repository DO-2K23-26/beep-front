import { ChannelType } from "../../enums"

export interface CreateChannelRequest {
    serverId: string
    name: string
    type: ChannelType
    parentId?: string
}
