import { ServerEntity } from '@beep/contracts'
import { ButtonIcon } from '@beep/ui'
import { RoleEntity } from 'libs/shared/contracts/src/lib/entities/role.entity'

export interface RolesSettingsServerProps {
  server: ServerEntity
  roles: RoleEntity[]
  onCreateRole: () => void
  onUpdateRole: () => void
  onDeleteRole: () => void
}

export function RolesSettingsServer({
  server,
  roles,
  onCreateRole,
  onUpdateRole,
  onDeleteRole,
}: RolesSettingsServerProps) {
  return (
    <div className="flex flex-col w-full bg-violet-200 p-4 overflow-y-auto gap-4">
      <div className="flex justify-between items-center">
        <p className="text-slate-700 font-bold text-base sm:text-xl md:text-3xl">
          Rôles
        </p>
        <ButtonIcon
          icon={'lucide:circle-plus'}
          className="bg-violet-400 px-2 xl:px-3 py-2 font-semibold"
          title="Créer un rôle"
          onClick={onCreateRole}
          buttonProps={{ variant: 'hoverRounded' }}
          textHiddenResponsive
        />
      </div>
      {roles.length === 0 ? (
        <p className="text-slate-700 text-base sm:text-lg md:text-xl text-center w-full">
          Il n'y a aucun rôle pour ce serveur
        </p>
      ) : (
        <p>Y'en a {roles.length}</p>
      )}
      {roles.map((role) => (
        <p>{role.name + ' (' + role.permissions + ')'}</p>
      ))}
    </div>
  )
}
