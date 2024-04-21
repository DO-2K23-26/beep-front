import { ChannelEntity, ChannelType } from '@beep/contracts'
import ChannelsNavigation from '../ui/channels-navigation'
import { useForm } from 'react-hook-form'
import { useModal } from '@beep/ui'
import { toast } from 'react-hot-toast'

const channels: ChannelEntity[] = [
  {
    id: '1',
    name: 'Salut les amis',
    server_id: '13',
    type: ChannelType.TEXT,
  },
  {
    id: '2',
    name: 'Nous sommes des salons vocaux',
    server_id: '13',
    type: ChannelType.TEXT,
  },
]

const server = {
  id: '@03248567',
  name: '418erreur',
  owner_id: 'Rapidement',
  picture: '/418.jpg',
}

export default function ChannelsNavigationFeature() {
  const { openModal, closeModal } = useModal()

  const methodsAddChannel = useForm({
    mode: 'onChange',
    defaultValues: {
      name: '',
    },
  })

  const onCreateChannel = methodsAddChannel.handleSubmit((data) => {
    console.log('Create channel')
    toast.success('Channel created !')
    closeModal()
  })

  return (
    <ChannelsNavigation
      channels={channels}
      server={server}
      onCreateChannel={onCreateChannel}
      openModal={openModal}
      closeModal={closeModal}
      methodsAddChannel={methodsAddChannel}
    />
  )
}
