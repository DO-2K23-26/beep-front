import { MessageEntity } from "../../entities"

export interface GetMessagesResponse {
    id: string
    name: string
    createdAt: string
    updatedAt: string
    messages: MessageEntity[]
}