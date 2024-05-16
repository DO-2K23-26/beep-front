export interface UpdateMessageRequest {
    channelId: string
    messageId: string
    content: string
    attachments: FormData
}