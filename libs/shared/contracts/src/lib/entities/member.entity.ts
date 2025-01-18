import { Role } from './role.entity'
import { Permissions } from '../enums/permissions-server'
// eslint-disable-next-line @nx/enforce-module-boundaries
import { permissionsService } from '@beep/utils'

export interface MemberEntity {
  nickname: string
  avatar: string
  deaf: boolean
  mute: boolean
  pending: boolean
  timedOutUntil: string | null
  serverId: string
  joinedAt: string
  createdAt: string
  updatedAt: string
  id: string
  userId: string
  roles: Role[]
}

export class Member implements MemberEntity {
  nickname: string
  avatar: string
  deaf: boolean
  mute: boolean
  pending: boolean
  timedOutUntil: string | null
  serverId: string
  joinedAt: string
  createdAt: string
  updatedAt: string
  id: string
  userId: string
  roles: Role[]

  constructor(member: MemberEntity) {
    this.nickname = member.nickname
    this.avatar = member.avatar
    this.deaf = member.deaf
    this.mute = member.mute
    this.pending = member.pending
    this.timedOutUntil = member.timedOutUntil
    this.serverId = member.serverId
    this.joinedAt = member.joinedAt
    this.createdAt = member.createdAt
    this.updatedAt = member.updatedAt
    this.id = member.id
    this.userId = member.userId
    this.roles = member.roles
  }

  hasPermissions(permissions: Permissions[]): boolean {
    return (
      permissionsService.hasOne(this, permissions) ||
      permissionsService.hasPermission(this, Permissions.ADMINISTRATOR)
    )
  }

  hasPermission(permission: Permissions): boolean {
    return permissionsService.hasPermission(this, permission)
  }
}
