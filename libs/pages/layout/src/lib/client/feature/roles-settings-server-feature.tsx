import { ServerEntity, RoleEntity, serverRoles } from '@beep/contracts'
import { useModal } from '@beep/ui'
import {
  useCreateServerRoleMutation,
  useDeleteServerRoleMutation,
  useGetRolesQuery,
  useUpdateServerRoleMutation,
} from '@beep/server'
import { FormProvider, useForm } from 'react-hook-form'
import { RoleForm } from '../ui/role-settings/role-form'
import { RolesSettingsServer } from '../ui/role-settings/roles-settings-server'
import { useEffect } from 'react'
import toast from 'react-hot-toast'
import { useTranslation } from 'react-i18next'

interface RolesSettingsServerFeatureProps {
  server: ServerEntity
}

export default function RolesSettingsServerFeature({
  server,
}: Readonly<RolesSettingsServerFeatureProps>) {
  const { data: roles } = useGetRolesQuery(server.id)
  const { openModal, closeModal } = useModal()
  const { t } = useTranslation()

  const methodsRoleForm = useForm({
    mode: 'onChange',
    defaultValues: {
      roleId: null as string | null,
      name: '',
      permissions: [] as string[],
    },
  })

  const [createRole, resultCreatedRole] = useCreateServerRoleMutation()
  const [updateRole, resultUpdatedRole] = useUpdateServerRoleMutation()
  const [deleteRole, resultDeletedRole] = useDeleteServerRoleMutation()

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
    if (!data.roleId) {
      toast.error(t('layout.roles-settings-server-feature.no_role_found'))
      return
    }

    updateRole({
      id: data.roleId,
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
      toast.success(t('layout.roles-settings-server-feature.role_created'))
    } else if (resultCreatedRole.isError) {
      toast.error(t('layout.roles-settings-server-feature.role_error_creating'))
    }
  }, [resultCreatedRole])

  // catch the result of the update role api mutation
  useEffect(() => {
    if (resultUpdatedRole.isSuccess) {
      onCloseModal()
      toast.success(t('layout.roles-settings-server-feature.role_updated'))
    } else if (resultUpdatedRole.isError) {
      toast.error(t('layout.roles-settings-server-feature.role_error_updating'))
    }
  }, [resultUpdatedRole])

  // catch the result of the delete role api mutation
  useEffect(() => {
    if (resultDeletedRole.isSuccess) {
      toast.success(t('layout.roles-settings-server-feature.role_deleted'))
    } else if (resultDeletedRole.isError) {
      toast.error(t('layout.roles-settings-server-feature.role_error_deleting'))
    }
  }, [resultDeletedRole])

  const onCreateRole = () => {
    methodsRoleForm.reset()
    openModal({
      content: (
        <FormProvider {...methodsRoleForm}>
          <RoleForm
            formType="create"
            loading={resultCreatedRole.isLoading}
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
      toast.error(t('layout.roles-settings-server-feature.no_role_found'))
      return
    }

    methodsRoleForm.setValue('roleId', role.id)
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
            loading={resultUpdatedRole.isLoading}
            closeModal={onCloseModal}
            onSubmitForm={onSubmitUpdateRoleForm}
            methodsRoleForm={methodsRoleForm}
          />
        </FormProvider>
      ),
    })
  }

  const onDeleteRole = (roleId: string) => {
    deleteRole({
      id: roleId,
      serverId: server.id,
    })
  }

  const onCloseModal = () => {
    methodsRoleForm.reset()
    closeModal()
  }

  return (
    <RolesSettingsServer
      roles={roles ?? []}
      onCreateRole={onCreateRole}
      onUpdateRole={onUpdateRole}
      onDeleteRole={onDeleteRole}
    />
  )
}
