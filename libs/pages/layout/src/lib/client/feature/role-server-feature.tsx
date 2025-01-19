import { RoleEntity } from '@beep/contracts'
import { RoleServer } from '../ui/role-settings/role-server'

export interface RoleServerFeatureProps {
  role: RoleEntity
  onUpdateRole: (roleId: string) => void
  onDeleteRole: (roleId: string) => void
}

export default function RoleServerFeature({
  role,
  onUpdateRole,
  onDeleteRole,
}: Readonly<RoleServerFeatureProps>) {
  return (
    <RoleServer
      role={role}
      onUpdateRole={onUpdateRole}
      onDeleteRole={onDeleteRole}
    />
  )
}
