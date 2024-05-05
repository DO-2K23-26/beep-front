import { ChannelEntity, ChannelType } from '@beep/contracts'
import ChannelsNavigation from '../ui/channels-navigation'
import { useForm } from 'react-hook-form'
import { useModal } from '@beep/ui'
import { toast } from 'react-hot-toast'
import { AppDispatch } from '@beep/store'
import { useDispatch, useSelector } from 'react-redux'
import { responsiveActions } from '@beep/responsive'
import { getServersState } from '@beep/server'

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

export default function ChannelsNavigationFeature() {
  const server = useSelector(getServersState)
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
