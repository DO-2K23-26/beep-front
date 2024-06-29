import { UserEntity } from "./user.entity"
import { Attachment } from './attachment.entity';

export interface MessageEntity {
    id: string
    ownerId: string
    content: string
    channelId: string
    attachments?: Attachment[]
    owner?: UserEntity
    createdAt?: string
    updatedAt?: string
    pinned: boolean
  }
