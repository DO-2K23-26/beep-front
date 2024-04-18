import { UserEntity } from "../entities"

export interface UserState {
    user?: UserEntity
    isAuthenticated: boolean
    isLoading: boolean
    isConfirmed: boolean
    tokens: {
        refreshToken?: string | null
        accessToken?: string | null
    }
    payload?: {
        isConfirmed: boolean
        sub: string
        exp: number
        resource_access: {
            roles: string[]
        }
    }
}
