import { RoleEntity } from '@beep/contracts'
import { RoleServer } from '../ui/role-settings/role-server'

export interface RoleServerFeatureProps {
  role: RoleEntity
  onUpdateRole: (roleId: string) => void
}

export default function RoleServerFeature({
  role,
  onUpdateRole,
}: Readonly<RoleServerFeatureProps>) {
  return <RoleServer role={role} onUpdateRole={onUpdateRole} />
}
