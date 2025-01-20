import { RoleEntity } from '@beep/contracts'
import { ButtonIcon } from '@beep/ui'
import { useTranslation } from 'react-i18next'
import { DropdownRole } from './dropdown-role'
import { RoleServer } from './role-server'

export interface RolesSettingsServerProps {
  roles: RoleEntity[]
  onClickCreateRole?: () => void
}

export function RolesSettingsServer({
  roles,
  onClickCreateRole,
}: RolesSettingsServerProps) {
  const { t } = useTranslation()

  return (
    <div className="flex flex-col w-full bg-violet-200 p-4 overflow-y-auto gap-4">
      <div className="flex justify-between items-center">
        <p className="text-slate-700 font-bold text-base sm:text-xl md:text-3xl">
          {t('layout.role-settings-server.roles')}
        </p>
        <ButtonIcon
          icon={'lucide:circle-plus'}
          className="bg-violet-400 px-2 xl:px-3 py-2 font-semibold"
          title={t('layout.role-settings-server.create_role')}
          buttonProps={{ variant: 'hoverRounded' }}
          textHiddenResponsive
          onClick={onClickCreateRole}
        />
      </div>
      {roles.length === 0 && (
        <p className="text-slate-700 text-base sm:text-lg md:text-xl text-center w-full">
          {t('layout.role-settings-server.no_roles')}
        </p>
      )}
      {roles.map((role) => (
        <RoleServer key={role.id} role={role}>
          <DropdownRole />
        </RoleServer>
      ))}
    </div>
  )
}
