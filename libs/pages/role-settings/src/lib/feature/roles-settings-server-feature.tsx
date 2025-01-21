import { ServerEntity } from '@beep/contracts'
import { useGetRolesQuery } from '@beep/server'
import { ReactNode, useState } from 'react'
import { RolesEditionPage } from '../ui/roles-edition-page'
import { RolesSettingsServer } from '../ui/roles-settings-server'
import { Page } from '../utils/roles-pages'

interface RolesSettingsServerFeatureProps {
  server: ServerEntity
}

interface RolePage {
  id: Page
  content: ReactNode
}
export function RolesSettingsServerFeature({
  server,
}: RolesSettingsServerFeatureProps) {
  const { data: roles } = useGetRolesQuery(server.id)
  const [focusedPage, setFocusedPage] = useState<Page>(Page.DisplayRole)
  const goTo = (page: Page) => setFocusedPage(page)

  const pages: RolePage[] = [
    {
      id: Page.DisplayRole,
      content: (
        <RolesSettingsServer
          roles={roles || []}
          onClickCreateRole={() => goTo(Page.RoleEdition)}
        />
      ),
    },
    {
      id: Page.RoleEdition,
      content: (
        <RolesEditionPage roles={roles} goBack={() => goTo(Page.DisplayRole)} />
      ),
    },
  ]

  return pages.find((page) => page.id === focusedPage)?.content
}
