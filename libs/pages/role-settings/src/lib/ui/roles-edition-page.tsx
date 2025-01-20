import { DateTime } from 'luxon'
import { EditRoleProvider } from '../feature/edit-role-provider'
import { RoleEditionPage } from './role-edition-page'
import { ButtonIcon } from '@beep/ui'
import { RoleEntity } from '@beep/contracts'
import { useState } from 'react'
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
    return (
      <EditRoleProvider key={role.id} role={role}>
        <RoleEditionPage />
      </EditRoleProvider>
    )
  })

  return (
    <div className="flex flex-col items-start w-full ">
      <ButtonIcon
        className="bg-transparent"
        icon="lucide:arrow-left-from-line"
        onClick={goBack}
        buttonProps={{ variant: 'ghost' }}
      />
      <div className="flex flex-row items-start divide-x-2 gap-2 w-full">
        <div className="flex w-1/6 overflow-hidden ">
          {roles?.map((role) => (
            <RoleServer key={role.id} role={role} />
          ))}
        </div>
        <div className="flex w-5/6 overflow-auto h-dvh">
          {roleEditionPages?.find((page) => page.key === selectedRole)}
        </div>
      </div>
    </div>
  )
}
