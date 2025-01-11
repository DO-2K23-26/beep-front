import { ServerEntity } from '@beep/contracts'
import { RolesSettingsServer } from '../ui/roles-settings-server'
import { useSelector } from 'react-redux'
import { RootState } from '@beep/store'
import { useModal } from '@beep/ui'

interface RolesSettingsServerFeatureProps {
  server: ServerEntity
}

export default function RolesSettingsServerFeature({
  server,
}: Readonly<RolesSettingsServerFeatureProps>) {
  const roles = useSelector((state: RootState) => state.servers.roles)
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
      roles={roles}
      onCreateRole={onCreateRole}
      onUpdateRole={onUpdateRole}
      onDeleteRole={onDeleteRole}
    />
  )
}
