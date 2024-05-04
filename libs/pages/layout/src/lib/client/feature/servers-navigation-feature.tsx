import { ServerEntity } from '@beep/contracts'
import ServersNavigation from '../ui/servers-navigation'
import { useModal } from '@beep/ui'
import { useForm } from 'react-hook-form'
import { toast } from 'react-hot-toast'

const servers: ServerEntity[] = [
]

const onLogout = () => {
  console.log('Logout')
  toast.success('Successfully logged out !')
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
    toast.success('Server created !')
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
