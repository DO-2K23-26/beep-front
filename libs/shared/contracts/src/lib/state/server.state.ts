import { ServerEntity } from '../entities'
import { RoleEntity } from '../entities/role.entity'

export interface ServerState {
  server: ServerEntity | undefined
  roles: RoleEntity[]
  inviteCode: string | null
}
