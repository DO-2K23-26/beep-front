import { UserEntity } from '../entities'

export interface UserState {
  user?: UserEntity
  isAuthenticated: boolean
  isLoading: boolean
  TOTPAuthentication: boolean
  tokens: {
    refreshToken?: string | null
    accessToken?: string | null
  }
  payload?: UserStatePayload
  isMuted: boolean
  isScreenShared: boolean
  isVoiceMuted: boolean
  isCamera: boolean
}

export interface UserStatePayload {
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
