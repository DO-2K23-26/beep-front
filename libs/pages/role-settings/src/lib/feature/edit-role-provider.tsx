import { MemberEntity, Permissions, RoleEntity } from '@beep/contracts'
import {
  useAssignMembersToRoleMutation,
  useCreateRoleMutation,
  useGetMembersQuery,
  useGetRoleMembersQuery,
  useUnassignMemberFromRoleMutation,
  useUpdateServerRoleMutation,
} from '@beep/server'
import { PropsWithChildren, createContext, useEffect } from 'react'
import {
  Control,
  FieldValues,
  UseFormReset,
  UseFormReturn,
  useForm,
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
  assignMembers?: (members: MemberEntity[]) => void
  unassignMember?: (member: MemberEntity) => void
  roleFormControl?: Control<T>
  resetRoleForm?: UseFormReset<T>
  editRoleForm?: UseFormReturn<T>
  isFormTouched?: boolean
  formPermissions?: Permissions[]
  loadingEdit?: boolean
  roleMembers?: MemberEntity[]
  serverMembers?: MemberEntity[]
  isLoadingMembers?: boolean
  isLoadingAssignMembers?: boolean
  isFinishAssignMembers?: boolean
  isFinishUnassignMembers?: boolean
  isLoadingUnassignMembers?: boolean
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

  const [updateRole, updateResult] = useUpdateServerRoleMutation()
  const [createRole, createResult] = useCreateRoleMutation()
  const { data: roleMembers, isLoading: isLoadingMembers } =
    useGetRoleMembersQuery({
      serverId: serverId,
      roleId: role?.id ?? '',
    })

  const { data: serverMembers } = useGetMembersQuery(serverId)

  const [assignMembersReq, assignMembersResult] =
    useAssignMembersToRoleMutation()
  const [unassignMembersReq, unassignMemberResult] =
    useUnassignMemberFromRoleMutation()

  const unassignMember = (member: MemberEntity) => {
    unassignMembersReq({
      serverId,
      roleId: role?.id ?? '',
      memberId: member.id,
    })
  }

  const assignMembers = (members: MemberEntity[]) => {
    assignMembersReq({
      serverId,
      roleId: role?.id ?? '',
      memberIds: members.map((m) => m.id),
    })
  }

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
        shouldDirty: true,
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

  useEffect(() => {
    if (createResult.isSuccess || updateResult.isSuccess) {
      editRoleForm.reset({
        name: updateResult?.data?.name ?? '',
        permissions: [] as Permissions[],
      })
      updateResult.reset()
      createResult.reset()
    }
  }, [
    createResult,
    createResult.isSuccess,
    editRoleForm,
    handleSubmit,
    role?.name,
    role?.permissions,
    updateResult,
    updateResult.isSuccess,
  ])

  useEffect(() => {
    if (unassignMemberResult.isError || unassignMemberResult.isSuccess)
      unassignMemberResult.reset()
  }, [unassignMemberResult])

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
        loadingEdit: updateResult.isLoading || createResult.isLoading,
        roleMembers,
        isLoadingMembers,
        assignMembers,
        unassignMember,
        serverMembers,
        isLoadingAssignMembers: assignMembersResult.isLoading,
        isLoadingUnassignMembers: unassignMemberResult.isLoading,
        isFinishAssignMembers:
          assignMembersResult.isSuccess || assignMembersResult.isError,
        isFinishUnassignMembers:
          unassignMemberResult.isSuccess || unassignMemberResult.isError,
      }}
    >
      {children}
    </EditRoleContext.Provider>
  )
}
