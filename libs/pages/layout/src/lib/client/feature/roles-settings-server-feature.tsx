import { ServerEntity, RoleEntity, serverRoles } from '@beep/contracts'
import { useModal } from '@beep/ui'
import {
  useCreateServerRoleMutation,
  useGetRolesQuery,
  useUpdateServerRoleMutation,
} from '@beep/server'
import { FormProvider, useForm } from 'react-hook-form'
import { RoleForm } from '../ui/role-settings/role-form'
import { RolesSettingsServer } from '../ui/role-settings/roles-settings-server'
import { useEffect, useState } from 'react'
import toast from 'react-hot-toast'

interface RolesSettingsServerFeatureProps {
  server: ServerEntity
}

export default function RolesSettingsServerFeature({
  server,
}: Readonly<RolesSettingsServerFeatureProps>) {
  const { data: roles } = useGetRolesQuery(server.id)
  const { openModal, closeModal } = useModal()

  // keep track of the role id being edited. If null, no role is being edited
  const [roleIdEditing, setRoleIdEditing] = useState<string | null>(null)

  const methodsRoleForm = useForm({
    mode: 'onChange',
    defaultValues: {
      name: '',
      permissions: [] as string[],
    },
  })

  const [createRole, resultCreatedRole] = useCreateServerRoleMutation()
  const [updateRole, resultUpdatedRole] = useUpdateServerRoleMutation()

  const onSubmitCreateRoleForm = methodsRoleForm.handleSubmit(async (data) => {
    createRole({
      serverId: server.id,
      name: data.name,
      permissions: data.permissions
        .map((p) => Number(p))
        .reduce((permission, curr) => permission + curr, 0x0),
    })
  })

  const onSubmitUpdateRoleForm = methodsRoleForm.handleSubmit(async (data) => {
    // If no role is being edited (means modal close), show an error message
    if (!roleIdEditing) {
      toast.error('Any role selected to update')
      return
    }

    updateRole({
      id: roleIdEditing,
      serverId: server.id,
      name: data.name,
      permissions: data.permissions
        .map((p) => Number(p))
        .reduce((permission, curr) => permission + curr, 0x0),
    })
  })

  // catch the result of the create role api mutation
  useEffect(() => {
    if (resultCreatedRole.isSuccess) {
      onCloseModal()
      methodsRoleForm.reset()
      toast.success('Role created')
    } else if (resultCreatedRole.isError) {
      toast.error('Error creating role')
    }
  }, [resultCreatedRole])

  // catch the result of the update role api mutation
  useEffect(() => {
    if (resultUpdatedRole.isSuccess) {
      onCloseModal()
      toast.success('Role updated')
    } else if (resultUpdatedRole.isError) {
      toast.error('Error updating role')
    }
  }, [resultUpdatedRole])

  const onCreateRole = () => {
    methodsRoleForm.reset()
    setRoleIdEditing(null)
    openModal({
      content: (
        <FormProvider {...methodsRoleForm}>
          <RoleForm
            formType="create"
            closeModal={onCloseModal}
            onSubmitForm={onSubmitCreateRoleForm}
            methodsRoleForm={methodsRoleForm}
          />
        </FormProvider>
      ),
    })
  }

  const onUpdateRole = (roleId: string) => {
    const role: RoleEntity | undefined = roles?.find(
      (role) => role.id === roleId
    )
    if (!role) {
      toast.error('Role not found, please try again')
      return
    }

    methodsRoleForm.setValue('name', role.name)
    methodsRoleForm.setValue(
      'permissions',
      serverRoles
        .map((role) => role.value)
        .filter((p) => role.permissions & p)
        .map((p) => p.toString())
    )

    openModal({
      content: (
        <FormProvider {...methodsRoleForm}>
          <RoleForm
            formType="update"
            closeModal={onCloseModal}
            onSubmitForm={onSubmitUpdateRoleForm}
            methodsRoleForm={methodsRoleForm}
          />
        </FormProvider>
      ),
    })
  }

  const onDeleteRole = () => {
    alert('delete role')
  }

  const onCloseModal = () => {
    setRoleIdEditing(null)
    methodsRoleForm.reset()
    closeModal()
  }

  // show the role form when a role is being edited
  useEffect(() => {
    if (roleIdEditing) {
      onUpdateRole(roleIdEditing)
    }
  }, [roleIdEditing])

  return (
    <RolesSettingsServer
      server={server}
      roles={roles ?? []}
      onCreateRole={onCreateRole}
      onUpdateRole={(roleId: string) => setRoleIdEditing(roleId)}
      onDeleteRole={onDeleteRole}
    />
  )
}
