import { ButtonIcon } from '@beep/ui'
import { RoleEntity } from 'libs/shared/contracts/src/lib/entities/role.entity'

export interface RoleServerProps {
  role: RoleEntity
}

export function RoleServer({ role }: RoleServerProps) {
  return (
    <div className="flex justify-between items-center">
      <p className="font-bold text-base">{role.name}</p>
      <ButtonIcon
        icon={'lucide:ellipsis-vertical'}
        className="bg-violet-400 p-2"
        onClick={() => {}}
        buttonProps={{ variant: 'hoverRounded' }}
        textHiddenResponsive
      />
    </div>
  )
}
