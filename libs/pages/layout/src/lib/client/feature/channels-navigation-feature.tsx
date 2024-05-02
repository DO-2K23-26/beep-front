import { ChannelEntity, ChannelType, CreateChannelRequest } from '@beep/contracts'
import ChannelsNavigation from '../ui/channels-navigation'
import { useForm } from 'react-hook-form'
import { useModal } from '@beep/ui'
import { toast } from 'react-hot-toast'
<<<<<<< HEAD
import { AppDispatch } from '@beep/store'
import { useDispatch } from 'react-redux'
import { responsiveActions } from '@beep/responsive'

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
=======
import { useCreateChannelMutation, useGetChannelsQuery } from '@beep/channel'
import { useEffect } from 'react'
>>>>>>> fbce31e (connect add channel API + get channels)

const server = {
  id: '@03248567',
  name: '418erreur',
  owner_id: 'Rapidement',
  picture: '/418.jpg',
}

export default function ChannelsNavigationFeature() {
  const { openModal, closeModal } = useModal()

  const [createChannel, resultCreatedChannel] = useCreateChannelMutation()
  const {data: channels} = useGetChannelsQuery()

  useEffect(() => {
    if (resultCreatedChannel.isSuccess && resultCreatedChannel.data !== undefined) {
      toast.success('Channel created !')
    } else if (resultCreatedChannel.isError) {
      toast.error('An error occured while creating the channel !')
    }
  }, [resultCreatedChannel])

  const methodsAddChannel = useForm({
    mode: 'onChange',
    defaultValues: {
      name: '',
    },
  })

  const onCreateChannel = methodsAddChannel.handleSubmit((data) => {
    createChannel(data as CreateChannelRequest)
    closeModal()
  })

  const dispatch = useDispatch<AppDispatch>()
  const hideLeftDiv = () => {
    dispatch(responsiveActions.manageLeftPane())
  }

  return (
    <ChannelsNavigation
      channels={channels}
      server={server}
      onCreateChannel={onCreateChannel}
      openModal={openModal}
      closeModal={closeModal}
      methodsAddChannel={methodsAddChannel}
      hideLeftDiv={hideLeftDiv}
    />
  )
}
