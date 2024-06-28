export interface JoinInvitationResponse {
  createdAt: string
  updatedAt: string
  expiration: string
  id: string
  isUnique: boolean
  serverId: string
  state: 'usable' | 'unusable'
  creatorId: string
}
