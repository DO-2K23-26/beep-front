import { ButtonIcon } from '@beep/ui'
import { useContext, useMemo } from 'react'
import { EditRoleProvider } from '../feature/edit-role-provider'
import { RolesSettingsContext } from '../feature/roles-settings-provider'
import { RoleEditionPage } from './role-edition-page'
import { RoleServer } from './role-server'
import { Page } from '../utils/roles-pages'

export function RolesEditionPage() {
  const { roles, selectedRole, goTo, selectRole } =
    useContext(RolesSettingsContext)
  const roleEditionPages = roles?.map((role) => {
    return {
      id: role.id,
      page: (
        <EditRoleProvider key={role.id} role={role}>
          <RoleEditionPage />
        </EditRoleProvider>
      ),
    }
  })

  const goBack = () => {
    goTo && goTo(Page.DisplayRole)
  }
  const focusedRolePage = useMemo(() => {
    return roleEditionPages?.find((page) => page.id === selectedRole)?.page
  }, [roleEditionPages, selectedRole])

  return (
    <div className="flex flex-col items-start w-full h-full">
      <div className="flex flex-row divide-x-2 gap-2 w-full h-full">
        <div className="flex flex-col w-1/6 overflow-hidden gap-2">
          <ButtonIcon
            className="bg-transparent"
            icon="lucide:arrow-left-from-line"
            onClick={goBack}
            buttonProps={{ variant: 'ghost' }}
          />
          {roles?.map((role) => (
            <RoleServer
              key={role.id}
              role={role}
              onClick={() => selectRole && selectRole(role.id)}
              highlight={role.id === selectedRole}
            />
          ))}
        </div>
        <div className="flex w-5/6 h-full">{focusedRolePage}</div>
      </div>
    </div>
  )
}
