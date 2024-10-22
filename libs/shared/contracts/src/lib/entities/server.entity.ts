export interface ServerEntity {
  id: string
  name: string
  ownerId: string
  visibility: 'public' | 'private'
  picture?: string
  createdAt?: string
  updatedAt?: string
  invite_code?: string | ''
  banner?: string
  description?: string
}
