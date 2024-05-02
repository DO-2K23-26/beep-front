import { UserEntity } from "../../entities"

export interface LoginResponse {
  tokens: {
    accessToken: string
    refreshToken: string
  }
  user: UserEntity
}