import { DateTime } from 'luxon'
import { EditRoleProvider } from '../feature/edit-role-provider'
import { RoleEditionPage } from './role-edition-page'
import { ButtonIcon } from '@beep/ui'

interface RolesEditionPageProps {
  goBack?: () => void
}

export function RolesEditionPage({ goBack }: RolesEditionPageProps) {
  return (
    <div>
      <ButtonIcon
        className="bg-transparent"
        icon="lucide:arrow-left-from-line"
        onClick={goBack}
        buttonProps={{ variant: 'ghost' }}
      />
      <EditRoleProvider
        role={{
          id: '1',
          name: 'Admin',
          permissions: [],
          serverId: 'server1',
          createdAt: DateTime.now().toISO(),
          updatedAt: DateTime.now().toISO(),
        }}
      >
        <RoleEditionPage />
      </EditRoleProvider>
    </div>
  )
}
