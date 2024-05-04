import { UserEntity } from "../entities"

export interface LoginResponse {
  accessToken: string
  refreshToken: string
  user: UserEntity
}