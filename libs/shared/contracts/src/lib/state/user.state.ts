import { UserEntity } from "../entities"

export interface UserState {
    user?: UserEntity
    isAuthenticated: boolean
    tokens: {
        refreshToken?: string | null
        accessToken?: string | null
    }
    payload?: {
        sub: string
        exp: number
        resource_access: {
            roles: string[]
        }
    }
}
