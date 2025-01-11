import { ServerEntity } from '@beep/contracts'
import { RolesSettingsServer } from '../ui/roles-settings-server'
import { useModal } from '@beep/ui'
import { useGetRolesQuery } from '@beep/server'

interface RolesSettingsServerFeatureProps {
  server: ServerEntity
}

export default function RolesSettingsServerFeature({
  server,
}: Readonly<RolesSettingsServerFeatureProps>) {
  const { data: roles } = useGetRolesQuery(server.id)
  const { openModal, closeModal } = useModal()

  const onCreateRole = () => {
    openModal({
      content: <p>MODALLLL</p>,
    })
  }
  const onUpdateRole = () => {}
  const onDeleteRole = () => {}

  return (
    <RolesSettingsServer
      server={server}
      roles={roles ?? []}
      onCreateRole={onCreateRole}
      onUpdateRole={onUpdateRole}
      onDeleteRole={onDeleteRole}
    />
  )
}
