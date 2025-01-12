import { RoleEntity } from 'libs/shared/contracts/src/lib/entities/role.entity'
import { RoleServer } from '../ui/role-server'

export interface RoleServerFeatureProps {
  role: RoleEntity
}

export default function RoleServerFeature({
  role,
}: Readonly<RoleServerFeatureProps>) {
  return <RoleServer role={role} />
}
