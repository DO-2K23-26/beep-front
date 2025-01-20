import { ServerEntity } from '@beep/contracts'
import {
  useGetRolesQuery
} from '@beep/server'
import { RolesSettingsServer } from '../ui/role-settings/roles-settings-server'

interface RolesSettingsServerFeatureProps {
  server: ServerEntity
}

export default function RolesSettingsServerFeature({
  server,
}: Readonly<RolesSettingsServerFeatureProps>) {
  const { data: roles } = useGetRolesQuery(server.id)

  return (
    <RolesSettingsServer
      roles={roles ?? []}
    />
  )
}
