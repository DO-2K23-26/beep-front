import { ServerEntity } from '../entities'

export interface ServerState {
  server: ServerEntity | undefined
  inviteCode: string | null
}
