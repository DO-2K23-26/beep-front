import { ServerEntity, PermissionEntity } from '@beep/contracts'
import { useModal } from '@beep/ui'
import { useCreateServerRoleMutation, useGetRolesQuery } from '@beep/server'
import { FormProvider, useForm } from 'react-hook-form'
import { RoleForm } from '../ui/role-settings/role-form'
import { RolesSettingsServer } from '../ui/role-settings/roles-settings-server'
import { useEffect } from 'react'
import toast from 'react-hot-toast'

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
      permissions: [] as string[],
    },
  })

  const [createRole, resultCreatedRole] = useCreateServerRoleMutation()
  const onSubmitRoleForm = methodsAddRole.handleSubmit(async (data) => {
    const { permissions, name } = methodsAddRole.getValues()
    console.log(permissions)
    createRole({
      serverId: server.id,
      name: name,
      permissions: permissions
        .map((p) => Number(p))
        .reduce((permission, curr) => permission + curr, 0x0),
    })
    closeModal()
  })

  useEffect(() => {
    if (resultCreatedRole.isSuccess) {
      methodsAddRole.reset()
      toast.success('Role created')
    } else if (resultCreatedRole.isError) {
      toast.error('Error creating role')
    }
  }, [resultCreatedRole])

  const onCreateRole = () => {
    openModal({
      content: (
        <FormProvider {...methodsAddRole}>
          <RoleForm
            closeModal={closeModal}
            onCreateRole={onSubmitRoleForm}
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
