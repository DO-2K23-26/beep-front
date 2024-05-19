import { ConnectedUserEntity } from "./connected-user.entity"

export interface OccupiedChannelEntity {
    channelId: string
    users: ConnectedUserEntity[]
  }
    