import { RoleEntity } from '@beep/contracts'
import { ButtonIcon } from '@beep/ui'
import { useMemo, useState } from 'react'
import { EditRoleProvider } from '../feature/edit-role-provider'
import { RoleEditionPage } from './role-edition-page'
import { RoleServer } from './role-server'

interface RolesEditionPageProps {
  roles?: RoleEntity[]
  goBack?: () => void
}

export function RolesEditionPage({ roles, goBack }: RolesEditionPageProps) {
  const [selectedRole, setSelectedRole] = useState<string | undefined>(
    roles?.[0].id
  )

  const selectRole = (role: RoleEntity) => {
    setSelectedRole(role.id)
  }

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
              onClick={() => selectRole(role)}
              highlight={role.id === selectedRole}
            />
          ))}
        </div>
        <div className="flex w-5/6 h-full">{focusedRolePage}</div>
      </div>
    </div>
  )
}
