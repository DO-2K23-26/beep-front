import { useCreateChannelMutation, useGetChannelsQuery } from '@beep/channel'
import { responsiveActions } from '@beep/responsive'
import { getServersState } from '@beep/server'
import { AppDispatch } from '@beep/store'
import { useModal } from '@beep/ui'
import { useForm } from 'react-hook-form'
import { toast } from 'react-hot-toast'
import { useDispatch, useSelector } from 'react-redux'
import ChannelsNavigation from '../ui/channels-navigation'

export default function ChannelsNavigationFeature() {
  const { server } = useSelector(getServersState)
  const { data: channels } = useGetChannelsQuery(server?.id)
  const { openModal, closeModal } = useModal()
  const [createChannel] = useCreateChannelMutation()

  const methodsAddChannel = useForm({
    mode: 'onChange',
    defaultValues: {
      name: '',
    },
  })

  const onCreateChannel = methodsAddChannel.handleSubmit((data) => {
    createChannel({
      serverId: server.id,
      nom: data.name,
    })
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
