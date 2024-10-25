import { MessageEntity } from '../entities'

export interface SyncMessages {
  channelId: string
  messages: MessageEntity[]
}
