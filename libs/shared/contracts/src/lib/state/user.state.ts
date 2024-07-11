import { UserEntity } from '../entities'

export interface UserState {
  user?: UserEntity
  isAuthenticated: boolean
  isLoading: boolean
  tokens: {
    refreshToken?: string | null
    accessToken?: string | null
  }
  payload?: {
    audited_account: boolean
    sub: string
    exp: number
    resource_access: {
      roles: string[]
    }
    username: string
    firstName: string
    lastName: string
    email: string
  }
  isMuted: boolean
  isVoiceMuted: boolean
  isCamera: boolean
}
