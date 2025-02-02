import { MemberEntity, Permissions, Role } from '@beep/contracts'
// eslint-disable-next-line @nx/enforce-module-boundaries
import { ServerContext } from '@beep/pages/channels'
import {
  useAssignMembersToRoleMutation,
  useGetMembersQuery,
  useGetRoleMembersQuery,
  useUnassignMemberFromRoleMutation,
  useUpdateServerRoleMutation,
} from '@beep/server'
import { skipToken } from '@reduxjs/toolkit/query'
import {
  PropsWithChildren,
  createContext,
  useContext,
  useEffect,
  useMemo,
} from 'react'
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
  role?: Role
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
  notAssignedServerMembers?: MemberEntity[]
  isLoadingMembers?: boolean
  isLoadingAssignMembers?: boolean
  isFinishAssignMembers?: boolean
  isFinishUnassignMembers?: boolean
  isLoadingUnassignMembers?: boolean
  isDefaultRole?: boolean
}

export const EditRoleContext = createContext<
  IEditRoleContext<z.infer<typeof roleFormSchema>>
>({})

interface EditRoleProviderProps {
  role?: Role
}

export function EditRoleProvider({
  children,
  role,
}: PropsWithChildren<EditRoleProviderProps>) {
  const { server } = useContext(ServerContext)
  const [updateRole, updateResult] = useUpdateServerRoleMutation()
  const { data: roleMembers, isLoading: isLoadingMembers } =
    useGetRoleMembersQuery({
      serverId: role?.serverId ?? '',
      roleId: role?.id ?? '',
    })

  const { data: serverMembers } = useGetMembersQuery(
    role?.serverId ?? skipToken
  )

  const [assignMembersReq, assignMembersResult] =
    useAssignMembersToRoleMutation()
  const [unassignMembersReq, unassignMemberResult] =
    useUnassignMemberFromRoleMutation()

  const unassignMember = (member: MemberEntity) => {
    unassignMembersReq({
      serverId: role?.serverId ?? '',
      roleId: role?.id ?? '',
      memberId: member.id,
    })
  }

  const assignMembers = (members: MemberEntity[]) => {
    assignMembersReq({
      serverId: role?.serverId ?? '',
      roleId: role?.id ?? '',
      memberIds: members.map((m) => m.id),
    })
  }

  const editRoleForm = useForm<z.infer<typeof roleFormSchema>>({
    defaultValues: {
      name: role?.name,
      permissions: role?.getPermissions() ?? [],
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
      const editedRole = Role.fromRoleEntity({
        id: role?.id,
        name: name,
        permissions: permissions,
        serverId: server?.id ?? '',
      })
      updateRole({
        serverId: server?.id ?? '',
        role: editedRole,
      })
    }
  )

  useEffect(() => {
    if (updateResult.isSuccess) {
      editRoleForm.reset({
        name: updateResult?.data?.name ?? '',
        permissions: updateResult?.data?.getPermissions() ?? [],
      })
      updateResult.reset()
    }
  }, [editRoleForm, handleSubmit, updateResult, updateResult.isSuccess])

  useEffect(() => {
    if (unassignMemberResult.isError || unassignMemberResult.isSuccess)
      unassignMemberResult.reset()
  }, [unassignMemberResult])

  const notAssignedServerMembers = useMemo(() => {
    const member = serverMembers?.filter(
      (m) => !roleMembers?.find((rm) => rm.id === m.id)
    )
    return member
  }, [roleMembers, serverMembers])
  return (
    <EditRoleContext.Provider
      value={{
        role: role,
        handleSubmit,
        onCheckRole,
        roleFormControl: editRoleForm.control,
        editRoleForm,
        isFormTouched: editRoleForm.formState.isDirty,
        loadingEdit: updateResult.isLoading,
        roleMembers,
        isLoadingMembers,
        assignMembers,
        unassignMember,
        notAssignedServerMembers,
        isLoadingAssignMembers: assignMembersResult.isLoading,
        isLoadingUnassignMembers: unassignMemberResult.isLoading,
        isFinishAssignMembers:
          assignMembersResult.isSuccess || assignMembersResult.isError,
        isFinishUnassignMembers:
          unassignMemberResult.isSuccess || unassignMemberResult.isError,
        isDefaultRole: role?.id === role?.serverId,
      }}
    >
      {children}
    </EditRoleContext.Provider>
  )
}
