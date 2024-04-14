import { userRole } from "../enums/user-roles"

export interface UserEntity {
    id: string
    email: string
    username: string
    firstname: string
    lastname: string
    profilePicture: string
    roles: userRole[]
    created_at: string
    updated_at: string
}
