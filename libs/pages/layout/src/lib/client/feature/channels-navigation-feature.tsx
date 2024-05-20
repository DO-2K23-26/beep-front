import { CreateChannelRequest } from '@beep/contracts'
import ChannelsNavigation from '../ui/channels-navigation'
import { useForm } from 'react-hook-form'
import { useModal } from '@beep/ui'
import { toast } from 'react-hot-toast'
import { useCreateChannelMutation } from '@beep/channel'
import { useEffect } from 'react'
import { AppDispatch, RootState } from '@beep/store'
import { useDispatch, useSelector } from 'react-redux'
import { responsiveActions } from '@beep/responsive'
import { serverActions, useGetServerChannelsQuery, useGetServersQuery } from '@beep/server'
import { skipToken } from '@reduxjs/toolkit/query'

export default function ChannelsNavigationFeature() {
  const server = useSelector((state: RootState) => state.servers.server)
  const dispatch = useDispatch<AppDispatch>()
  const { openModal, closeModal } = useModal()
  const { data: servers } = useGetServersQuery();

  useEffect(() => {
    if (!server && servers && servers.length > 0) {
      dispatch(serverActions.setServer(servers[0]));
    }
  }, [server, servers, dispatch]);

  const [createChannel, resultCreatedChannel] = useCreateChannelMutation()
  const { data: channels } = useGetServerChannelsQuery(server?.id || skipToken)
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
