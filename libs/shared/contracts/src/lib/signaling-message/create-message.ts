import { MessageEntity } from "../entities";

export interface CreateMessage{
  message: MessageEntity
  transmitClientId: string
}
