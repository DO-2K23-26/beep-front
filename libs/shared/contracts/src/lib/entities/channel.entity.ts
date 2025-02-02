import { ChannelType } from '../enums/channel-type'
import { UserDisplayedEntity } from './user-displayed.entity'

export interface ChannelEntity {
  id: string
  name: string
  description: string
  serverId: string
  position: number
  type: ChannelType
  users: UserDisplayedEntity[]
  parentId?: string
  childrens?: ChannelEntity[]
  createdAt?: string
  updatedAt?: string
}
