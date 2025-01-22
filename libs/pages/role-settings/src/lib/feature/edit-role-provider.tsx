import { Permissions, RoleEntity } from '@beep/contracts'
import {
  useCreateServerRoleMutation,
  useUpdateServerRoleMutation,
} from '@beep/server'
import {
  PropsWithChildren,
  createContext,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react'
import {
  useForm,
  Control,
  UseFormReset,
  UseFormReturn,
  FieldValues,
  useFieldArray,
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
  formPermissions?: Permissions[]
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
  const permissionsDef: Permissions[] = []
  // eslint-disable-next-line react-hooks/exhaustive-deps
  // const defaultPermissions = role?.permissions ?? []

  const [updateRole, updateResult] = useUpdateServerRoleMutation()
  const [createRole, createResult] = useCreateServerRoleMutation()

  const permissions: Permissions[] = []
  const editRoleForm = useForm<z.infer<typeof roleFormSchema>>({
    defaultValues: {
      name: role?.name,
    },
  })

  const onCheckRole = (permission: Permissions, isChecked?: boolean) => {
    const currentPermissions = editRoleForm.getValues('permissions') || []
    const updatedPermissions = isChecked
      ? currentPermissions.filter((p) => p !== permission)
      : [...currentPermissions, permission]

    if (
      JSON.stringify(currentPermissions) !== JSON.stringify(updatedPermissions)
    ) {
      editRoleForm.setValue('permissions', updatedPermissions, {
        shouldTouch: true,
      })
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

  // useEffect(() => {
  //   if (createResult.isSuccess || updateResult.isSuccess) {
  //     setDefaultPermissions(role?.permissions ?? [])
  //     editRoleForm.reset(undefined, {
  //       keepDirtyValues: true,
  //     })
  //     updateResult.reset()
  //     createResult.reset()
  //   }
  // }, [
  //   createResult,
  //   createResult.isSuccess,
  //   editRoleForm,
  //   handleSubmit,
  //   role?.name,
  //   role?.permissions,
  //   updateResult,
  //   updateResult.isSuccess,
  // ])

  return (
    <EditRoleContext.Provider
      value={{
        role: role,
        permissions,
        handleSubmit,
        onCheckRole,
        roleFormControl: editRoleForm.control,
        editRoleForm,
        isFormTouched: editRoleForm.formState.isDirty,
      }}
    >
      {children}
    </EditRoleContext.Provider>
  )
}
