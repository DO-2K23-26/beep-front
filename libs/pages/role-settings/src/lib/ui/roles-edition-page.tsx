import { ButtonIcon } from '@beep/ui'
import { useContext } from 'react'
import { EditRoleProvider } from '../feature/edit-role-provider'
import { RolesSettingsContext } from '../feature/roles-settings-provider'
import { Page } from '../utils/roles-pages'
import { RoleEditionPage } from './role-edition-page'
import { RoleServer } from './role-server'

export function RolesEditionPage() {
  const { roles, selectedRole, goTo, selectRole, createRole } =
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

  return (
    <div className="flex flex-col items-start w-full h-full">
      <div className="flex flex-row divide-x-2 gap-2 w-full h-full">
        <div className="flex flex-col w-1/6 overflow-hidden gap-2">
          <div className="flex justify-between items-center w-full">
            <ButtonIcon
              className="bg-transparent"
              icon="lucide:arrow-left-from-line"
              onClick={goBack}
              buttonProps={{ variant: 'ghost' }}
            />
            <ButtonIcon
              className="bg-transparent"
              icon="lucide:plus"
              onClick={createRole}
              buttonProps={{ variant: 'ghost' }}
            />
          </div>
          {roles?.map((role) => (
            <RoleServer
              key={role.id}
              role={role}
              onClick={() => selectRole && selectRole(role.id)}
              highlight={role.id === selectedRole}
            />
          ))}
        </div>
        <div className="flex w-5/6 h-full">
          {roleEditionPages?.find((page) => page.id === selectedRole)?.page}
        </div>
      </div>
    </div>
  )
}
