import { UserRole } from "../enums/user-roles"
import { RoleEntity } from "./roles.entities"

export interface UserEntity {
    id: string
    email: string
    username: string
    firstname: string
    lastname: string
    profilePicture?: string
    roles?: RoleEntity[]
    verifiedAt: Date | null
    created_at?: string
    updated_at?: string
}
