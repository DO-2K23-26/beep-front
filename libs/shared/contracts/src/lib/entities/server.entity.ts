export interface ServerEntity {
  id: string
  name: string
  ownerId: string
  visibility: 'public' | 'private'
  picture?: string
  createdAt?: string
  updatedAt?: string
  inviteCode?: string | ''
  banner?: string
  description?: string
}
