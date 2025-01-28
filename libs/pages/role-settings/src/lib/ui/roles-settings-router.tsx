import { useContext } from 'react'
import { rolePages } from './roles-settings-pages'
import { RolesSettingsContext } from '../feature/roles-settings-provider'

export function RolesSettingsRouter() {
  const { focusedPage } = useContext(RolesSettingsContext)
  return rolePages.find((page) => page.id === focusedPage)?.content
}
