import { UserEntity } from "./user.entity"
import { Attachment } from './attachment.entity';
import { CreateMessageRequest } from "../request";

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
  parentMessageId?: string | null
  parentMessage?: MessageEntity | null

  // If the message sent by the current client this should be true
  // Else the field is undefined when it come from the server
  isSentByCurrentClient?: boolean

  // If the message come from the local we store the request
  request?: CreateMessageRequest

}
