import { RoleEntity, ServerEntity } from '@beep/contracts'
import {
  useCreateRoleMutation,
  useDeleteRoleMutation,
  useGetRolesQuery,
} from '@beep/server'
import { createContext, PropsWithChildren, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Page } from '../utils/roles-pages'

interface IRolesSettingsContext {
  roles?: RoleEntity[]
  focusedPage?: Page
  goTo?: (page: Page) => void
  goToRoleEdition?: (roleId: string) => void
  selectedRole?: string
  selectRole?: (role: string) => void
  createRole?: () => void
  isLoadingCreateRole?: boolean
  isSuccessCreateRole?: boolean
  deleteRole?: (roleId: string) => void
}

export const RolesSettingsContext = createContext<IRolesSettingsContext>({})

interface RolesSettingsProviderProps {
  server: ServerEntity
}

export function RolesSettingsProvider({
  children,
  server,
}: PropsWithChildren<RolesSettingsProviderProps>) {
  const { t } = useTranslation()
  const { data: roles } = useGetRolesQuery(server.id)
  const [focusedPage, setFocusedPage] = useState<Page>(Page.DisplayRole)
  const goTo = (page: Page) => setFocusedPage(page)

  const [selectedRole, setSelectedRole] = useState<string | undefined>(
    roles?.[0].id
  )

  const [createRoleReq, createRoleResult] = useCreateRoleMutation()
  const [deleteRoleReq, deleteRoleResult] = useDeleteRoleMutation()

  const goToRoleEdition = (roleId: string) => {
    setFocusedPage(Page.RoleEdition)
    setSelectedRole(roleId)
  }

  const createRole = () => {
    createRoleReq({
      serverId: server.id,
      name: t('role-settings.roles-settings-provider.new-role'),
      permissions: 0,
    })
  }

  const deleteRole = (roleId: string) => {
    deleteRoleReq({ serverId: server.id, id: roleId })
  }

  useEffect(() => {
    if (createRoleResult.isSuccess && createRoleResult.data) {
      goToRoleEdition(createRoleResult.data.id)
    }
  }, [createRoleResult])

  useEffect(() => {
    if (deleteRoleResult.isSuccess) {
      setSelectedRole(roles?.[0].id)
      deleteRoleResult.reset()
    }
  }, [deleteRoleResult, roles])

  return (
    <RolesSettingsContext.Provider
      value={{
        roles,
        focusedPage,
        goTo,
        goToRoleEdition,
        selectedRole,
        selectRole: setSelectedRole,
        createRole,
        isLoadingCreateRole: createRoleResult.isLoading,
        isSuccessCreateRole: createRoleResult.isSuccess,
        deleteRole,
      }}
    >
      {children}
    </RolesSettingsContext.Provider>
  )
}
