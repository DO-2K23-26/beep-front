import { MessageEntity } from "../entities/message.entity";

export interface MessageState {
  channels_messages: { [id: string]: MessageEntity[] };
}
