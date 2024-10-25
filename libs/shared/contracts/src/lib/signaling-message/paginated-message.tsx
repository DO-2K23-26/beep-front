import { MessageEntity } from '../entities'

export interface PaginatedMessage {
  channelId: string
  messages: MessageEntity[]
}
