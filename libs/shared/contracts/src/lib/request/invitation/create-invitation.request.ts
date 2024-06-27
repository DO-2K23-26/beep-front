import { DateTime } from "luxon"

export interface CreateInvitationRequest {
  serverId: string
  isUnique: boolean
  expiration: DateTime
}
