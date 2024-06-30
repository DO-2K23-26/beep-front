import { Meta } from '../../meta.interface'

export interface ChannelAttachment {
  id: string
  name: string
  contentType: string
  messageId: string
  createdAt: string | null
  updatedAt: string | null
}
export interface ChannelAttachmentsResponse {
  meta: Meta,
  data: ChannelAttachment[]
}