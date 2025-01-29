// eslint-disable-next-line @nx/enforce-module-boundaries
import { permissionsService } from '@beep/utils'
import { Permissions } from '../enums/permissions-server'
export interface RoleDefault {
  id?: string
  serverId: string
  createdAt?: string
  updatedAt?: string
  name: string
}

export interface RawRole extends RoleDefault {
  permissions: number
}

export interface RoleEntity extends RoleDefault {
  permissions: Permissions[]
}

export class Role implements RawRole {
  id?: string
  serverId: string
  createdAt?: string
  updatedAt?: string
  name: string
  permissions: number

  constructor(role: RawRole) {
    this.id = role.id
    this.serverId = role.serverId
    this.createdAt = role.createdAt
    this.updatedAt = role.updatedAt
    this.name = role.name
    this.permissions = role.permissions
  }

  public static fromRoleEntity(role: RoleEntity): Role {
    return new Role({
      id: role.id,
      serverId: role.serverId,
      createdAt: role.createdAt,
      updatedAt: role.updatedAt,
      name: role.name,
      permissions: permissionsService.permissionsToRaw(role.permissions),
    })
  }

  getRawPermissions(): number {
    return this.permissions
  }

  getPermissions(): Permissions[] {
    return permissionsService.rawToPermissions(this.permissions)
  }

  setPermisssionsFromRaw(rawPermissions: number): void {
    this.permissions = rawPermissions
  }

  setPermissions(permissions: Permissions[]): void {
    this.permissions = permissionsService.permissionsToRaw(permissions)
  }
}
