import { ServerEntity } from '@beep/contracts'
import { RolesSettingsRouter } from '../ui/roles-settings-router'
import { RolesSettingsProvider } from './roles-settings-provider'

interface RolesSettingsServerFeatureProps {
  server: ServerEntity
}

export function RolesSettingsServerFeature({
  server,
}: RolesSettingsServerFeatureProps) {
  return (
    <RolesSettingsProvider server={server}>
      <RolesSettingsRouter />
    </RolesSettingsProvider>
  )
}
