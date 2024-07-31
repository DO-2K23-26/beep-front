export interface PinMessageRequest {
  channelId: string
  messageId: string
  action: "pin" | "unpin"
}
