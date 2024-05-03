export interface CreateMessageRequest {
    channelId: string
    content: string
    attachments: unknown[]
}