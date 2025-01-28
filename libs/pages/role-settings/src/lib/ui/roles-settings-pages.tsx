import { ReactNode } from 'react'
import { Page } from '../utils/roles-pages'
import { RolesSettingsServer } from './roles-settings-server'
import { RolesEditionPage } from './roles-edition-page'

interface RolePage {
  id: Page
  content: ReactNode
}

export const rolePages: RolePage[] = [
  {
    id: Page.DisplayRole,
    content: <RolesSettingsServer />,
  },
  {
    id: Page.RoleEdition,
    content: <RolesEditionPage />,
  },
]
