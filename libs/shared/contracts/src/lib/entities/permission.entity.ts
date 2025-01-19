export interface PermissionEntity {
  id: string
  name: { [langage: string]: string }
  value: number
  description: { [langage: string]: string }
}
