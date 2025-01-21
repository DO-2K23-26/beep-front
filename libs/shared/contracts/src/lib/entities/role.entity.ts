import { Permissions } from '../enums/permissions-server'
export interface RoleEntity {
  id: string
  serverId: string
  createdAt: string
  updatedAt: string
  name: string
  permissions: Permissions[]
}

export interface RawRole {
  id: string
  serverId: string
  createdAt: string
  updatedAt: string
  name: string
  permissions: number
}
