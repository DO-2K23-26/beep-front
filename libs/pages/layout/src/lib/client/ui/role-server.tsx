import { RoleEntity } from 'libs/shared/contracts/src/lib/entities/role.entity'

export interface RoleServerProps {
  role: RoleEntity
}

export function RoleServer({ role }: RoleServerProps) {
  return (
    <div className="flex justify-between items-center text-base">
      <p className="font-bold text-base">{role.name}</p>
      <button>Modifier</button>
    </div>
  )
}
