export interface CreateMessageRequest {
    channelId: string
    content: string
    attachments?: FormData | null
}