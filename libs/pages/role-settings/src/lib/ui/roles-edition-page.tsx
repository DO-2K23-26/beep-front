import { EditRoleProvider } from '../feature/edit-role-provider'
import { CreateRoleDialog } from './role-edition-page'

export function RolesEditionPage() {
  return (
    <EditRoleProvider>
      <CreateRoleDialog />
    </EditRoleProvider>
  )
}
