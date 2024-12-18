import { CreateMessageRequest } from "../request";
import { Attachment } from './attachment.entity';
import { UserDisplayedEntity } from "./user-displayed.entity";

export interface MessageEntity {
  id: string
  ownerId: string
  content: string
  channelId: string
  attachments?: Attachment[]
  owner?: UserDisplayedEntity
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
