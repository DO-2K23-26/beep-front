import { UserConnectedEntity } from "./user-connected.entity"

export interface OccupiedChannelEntity {
    channelId: string
    users: UserConnectedEntity[]
  }
    