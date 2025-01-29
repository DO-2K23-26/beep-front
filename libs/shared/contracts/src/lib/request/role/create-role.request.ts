// eslint-disable-next-line @nx/enforce-module-boundaries
import { Role } from '@beep/contracts'
export interface CreateRoleRequest {
  serverId: string
  role: Role
}
