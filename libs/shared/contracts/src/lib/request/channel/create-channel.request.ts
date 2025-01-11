import { ChannelType } from "../../enums"

export interface CreateChannelRequest {
    serverId: string
    name: string
    position: number
    type: ChannelType
}
