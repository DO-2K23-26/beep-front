import { MessageEntity } from "../entities"

export enum ActionSignalMessage {
  create = "create",
  update = "update",
  delete = "delete",
}

export interface SignalMessage {
  action: ActionSignalMessage
  message: MessageEntity
}
