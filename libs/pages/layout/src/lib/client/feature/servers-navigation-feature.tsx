import { ServerEntity } from '@beep/contracts'
import ServersNavigation from '../ui/servers-navigation'
import { useModal } from '@beep/ui'
import { useForm } from 'react-hook-form'
import { toast } from 'react-hot-toast'
import { serverActions, useGetServersQuery, useJoinServerMutation } from '@beep/server'

const onLogout = () => {
  console.log('Logout')
  toast.success('Successfully logged out !')
}

const onPrivateMessage = () => {
  console.log('Private message')
}

export default function ServersNavigationFeature() {
  const { data: servers } = useGetServersQuery()
  const [joinServer ] = useJoinServerMutation()
  const { openModal, closeModal } = useModal()

  const methodsAddChannel = useForm({
    mode: 'onChange',
    defaultValues: {
      name: '',
    },
  })

  const onCreateServer = methodsAddChannel.handleSubmit((data) => {
    joinServer(data.name)
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
