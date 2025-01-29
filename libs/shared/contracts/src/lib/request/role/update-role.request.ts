import { Role } from "../../entities"

export interface UpdateRoleRequest {
  serverId: string
  role: Role
}
