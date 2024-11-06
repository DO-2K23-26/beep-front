export interface ServerEntity {
  id: string
  name: string
  ownerId: string
  visibility: 'public' | 'private'
  icon?: string
  createdAt?: string
  updatedAt?: string
  invite_code?: string | ''
  banner?: string
  description?: string
}
