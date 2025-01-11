export interface UpdateChannelRequest {
    serverId: string
    channelId: string
    name: string
    description: string
    position: number
}

export interface MoveChannelRequest {
    serverId: string
    channelId: string
    position: number
}
