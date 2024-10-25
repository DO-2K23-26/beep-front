export interface GetMessageFromChannelRequest {
  channelId: string

  // Message id to get messages before this message
  // Can be null therefore we can get the latest messages
  before: string | null

  // The number of messages we will fetch
  // 50 is a good amount
  limit: number
}
