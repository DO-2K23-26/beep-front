import { ServerEntity, PermissionEntity } from '@beep/contracts'
import { useModal } from '@beep/ui'
import { useGetRolesQuery } from '@beep/server'
import { FormProvider, useForm } from 'react-hook-form'
import { RoleForm } from '../ui/role-settings/role-form'
import { RolesSettingsServer } from '../ui/role-settings/roles-settings-server'

interface RolesSettingsServerFeatureProps {
  server: ServerEntity
}

export default function RolesSettingsServerFeature({
  server,
}: Readonly<RolesSettingsServerFeatureProps>) {
  const { data: roles } = useGetRolesQuery(server.id)
  const { openModal, closeModal } = useModal()

  const methodsAddRole = useForm({
    mode: 'onChange',
    defaultValues: {
      name: '',
      permissions: [] as PermissionEntity[],
    },
  })

  const onCreateRole = () => {
    openModal({
      content: (
        <FormProvider {...methodsAddRole}>
          <RoleForm
            closeModal={closeModal}
            onCreateRole={onCreateRole}
            methodsAddRole={methodsAddRole}
          />
        </FormProvider>
      ),
    })
  }
  const onUpdateRole = () => {
    alert('update role')
  }
  const onDeleteRole = () => {
    alert('delete role')
  }

  return (
    <RolesSettingsServer
      server={server}
      roles={roles ?? []}
      onCreateRole={onCreateRole}
      onUpdateRole={onUpdateRole}
      onDeleteRole={onDeleteRole}
    />
  )
}
