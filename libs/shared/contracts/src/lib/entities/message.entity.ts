import { UserEntity } from "./user.entity"

export interface MessageEntity {
    id: string
    ownerId: string
    content: string
    channelId: string
    attachments: unknown[]
    owner?: UserEntity
    createdAt: string
    updatedAt: string
  }