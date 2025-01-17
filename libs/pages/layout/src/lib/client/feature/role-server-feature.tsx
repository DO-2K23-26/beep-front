import { RoleEntity } from '@beep/contracts'
import { RoleServer } from '../ui/role-settings/role-server'

export interface RoleServerFeatureProps {
  role: RoleEntity
}

export default function RoleServerFeature({
  role,
}: Readonly<RoleServerFeatureProps>) {
  return <RoleServer role={role} />
}
