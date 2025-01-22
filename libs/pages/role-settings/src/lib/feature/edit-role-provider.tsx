import { Permissions, RoleEntity } from '@beep/contracts'
import {
  useCreateServerRoleMutation,
  useUpdateServerRoleMutation,
} from '@beep/server'
import { PropsWithChildren, createContext, useMemo } from 'react'
import {
  useForm,
  Control,
  UseFormReset,
  UseFormReturn,
  FieldValues,
} from 'react-hook-form'
import { z } from 'zod'

const roleFormSchema = z.object({
  name: z.string().min(1, {
    message: "Role name can't be empty",
  }),
  permissions: z.array(z.nativeEnum(Permissions)),
})
interface IEditRoleContext<T extends FieldValues> {
  role?: RoleEntity
  permissions: Permissions[]
  handleSubmit?: () => void
  onCheckRole?: (permission: Permissions, isChecked?: boolean) => void
  roleFormControl?: Control<T>
  resetRoleForm?: UseFormReset<T>
  editRoleForm?: UseFormReturn<T>
  isFormTouched?: boolean
}

export const EditRoleContext = createContext<
  IEditRoleContext<z.infer<typeof roleFormSchema>>
>({
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
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const defaultPermissions = (role?.permissions ??
    []) as unknown as Permissions[]
  const [updateRole] = useUpdateServerRoleMutation()
  const [createRole] = useCreateServerRoleMutation()

  const permissions: Permissions[] = []

  const editRoleForm = useForm<z.infer<typeof roleFormSchema>>({
    defaultValues: {
      name: role?.name,
      permissions: defaultPermissions,
    },
  })

  const onCheckRole = (permission: Permissions, isChecked?: boolean) => {
    if (!isChecked) {
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
  const formPermissions = editRoleForm.watch('permissions')
  const isFormTouched = useMemo(() => {
    return (
      editRoleForm.formState.isDirty ||
      formPermissions.toString() !== defaultPermissions.toString()
    )
  }, [defaultPermissions, editRoleForm.formState.isDirty, formPermissions])

  return (
    <EditRoleContext.Provider
      value={{
        role: role,
        permissions,
        handleSubmit,
        onCheckRole,
        roleFormControl: editRoleForm.control,
        resetRoleForm: editRoleForm.reset,
        editRoleForm,
        isFormTouched,
      }}
    >
      {children}
    </EditRoleContext.Provider>
  )
}
