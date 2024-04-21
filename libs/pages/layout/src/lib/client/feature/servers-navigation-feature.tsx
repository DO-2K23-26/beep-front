import { ServerEntity } from '@beep/contracts'
import ServersNavigation from '../ui/servers-navigation'
import { useModal } from '@beep/ui'
import { useForm } from 'react-hook-form'

const servers: ServerEntity[] = [
  {
    id: '@03248567',
    name: '418erreur',
    owner_id: 'Rapidement',
    picture: '/418.jpg',
  },
]

const onLogout = () => {
  console.log('Logout')
}

const onPrivateMessage = () => {
  console.log('Private message')
}

export default function ServersNavigationFeature() {
  const { openModal, closeModal } = useModal()

  const methodsAddChannel = useForm({
    mode: 'onChange',
    defaultValues: {
      name: '',
    },
  })

  const onCreateServer = methodsAddChannel.handleSubmit((data) => {
    console.log('Create server')
    closeModal()
  })
  return (
    <ServersNavigation
      servers={servers}
      onLogout={onLogout}
      onPrivateMessage={onPrivateMessage}
      onCreateServer={onCreateServer}
      openModal={openModal}
      closeModal={closeModal}
      methods={methodsAddChannel}
    />
  )
}
