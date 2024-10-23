import { MessageEntity } from "../../entities/message.entity"

// This is used to add message from the local client
// Those local messages are automatically sent to server
export interface SendMessageForm {
  channelId: string
  message: string
  replyTo: MessageEntity | null
  files: File[]
  userId: string
}
