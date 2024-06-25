export interface ServerEntity {
  id: string
  name: string
  owner_id: string
  visibility: 'public' | 'private'
  picture?: string
  created_at?: string
  updated_at?: string
  invite_code?: string | ''
}
