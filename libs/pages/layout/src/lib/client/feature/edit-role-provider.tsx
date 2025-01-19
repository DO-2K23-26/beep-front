import { Permissions, RoleEntity } from '@beep/contracts'
import {
  useCreateServerRoleMutation,
  useUpdateServerRoleMutation,
} from '@beep/server'
import { PropsWithChildren, createContext } from 'react'
import { useForm, Control, UseFormReset } from 'react-hook-form'
import { z } from 'zod'

interface IEditRoleContext {
  permissions: Permissions[]
  handleSubmit?: () => void
  onCheckRole?: (isChecked: boolean, permission: Permissions) => void
  roleFormControl?: Control<{
    name: string
    permissions: Permissions[]
  }>
  resetRoleFrom?: UseFormReset<{
    name: string
    permissions: Permissions[]
  }>
}

export const EditRoleContext = createContext<IEditRoleContext>({
  permissions: [],
})

interface EditRoleProviderProps {
  role?: RoleEntity
}

export function EditRoleProvider({
  children,
  role,
}: PropsWithChildren<EditRoleProviderProps>) {
  const serverId = ''
  const [updateRole] = useUpdateServerRoleMutation()
  const [createRole] = useCreateServerRoleMutation()

  const permissions: Permissions[] = []

  const roleFormSchema = z.object({
    name: z.string().min(1, {
      message: "Role name can't be empty",
    }),
    permissions: z.array(z.nativeEnum(Permissions)),
  })

  const editRoleForm = useForm<z.infer<typeof roleFormSchema>>({
    defaultValues: {
      name: role?.name || '',
      permissions: permissions,
    },
  })

  const onCheckRole = (isChecked: boolean, permission: Permissions) => {
    if (isChecked) {
      editRoleForm.setValue('permissions', [
        ...editRoleForm.getValues('permissions'),
        permission,
      ])
    } else {
      editRoleForm.setValue(
        'permissions',
        editRoleForm.getValues('permissions').filter((p) => p !== permission)
      )
    }
  }

  const handleSubmit = editRoleForm.handleSubmit(
    ({ name, permissions }: z.infer<typeof roleFormSchema>) => {
      const tranformedPermissions = 0
      if (role?.id) {
        updateRole({
          id: role.id,
          serverId: role.serverId,
          name: name,
          permissions: tranformedPermissions,
        })
      } else {
        createRole({
          serverId: serverId,
          name: name,
          permissions: tranformedPermissions,
        })
      }
    }
  )

  return (
    <EditRoleContext.Provider
      value={{
        permissions,
        handleSubmit,
        onCheckRole,
        roleFormControl: editRoleForm.control,
        resetRoleFrom: editRoleForm.reset,
      }}
    >
      {children}
    </EditRoleContext.Provider>
  )
}
