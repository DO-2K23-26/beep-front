import { voiceChannelActions } from '@beep/channel'
import {
  ChannelEntity,
  ChannelType,
  CreateChannelRequest,
} from '@beep/contracts'
import { responsiveActions } from '@beep/responsive'
import {
  serverActions,
  useCreateChannelInServerMutation,
  useGetCurrentStreamingUsersQuery,
  useGetServerChannelsQuery,
  useGetServersQuery,
} from '@beep/server'
import { AppDispatch, RootState } from '@beep/store'
import { useModal } from '@beep/ui'
import { skipToken } from '@reduxjs/toolkit/query'
import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'react-hot-toast'
import { useDispatch, useSelector } from 'react-redux'
import ChannelsNavigation from '../ui/channels-navigation'

export default function ChannelsNavigationFeature() {
  const server = useSelector((state: RootState) => state.servers.server)
  const { data: streamingUsers } = useGetCurrentStreamingUsersQuery(
    server?.id ?? ''
  )
  const dispatch = useDispatch<AppDispatch>()
  const { openModal, closeModal } = useModal()
  const { data: servers } = useGetServersQuery()

  useEffect(() => {
    if (!server && servers && servers.length > 0) {
      dispatch(serverActions.setServer(servers[0]))
    }
  }, [server, servers, dispatch])

  const [createChannel, resultCreatedChannel] =
    useCreateChannelInServerMutation()
  const { data: channels } = useGetServerChannelsQuery(server?.id ?? skipToken)
  useEffect(() => {
    if (
      resultCreatedChannel.isSuccess &&
      resultCreatedChannel.data !== undefined
    ) {
      toast.success('Channel created !')
    } else if (resultCreatedChannel.isError) {
      toast.error('An error occured while creating the channel !')
    }
  }, [resultCreatedChannel])

  const methodsAddChannel = useForm({
    mode: 'onChange',
    defaultValues: {
      name: '',
      type: ChannelType.TEXT,
    },
  })
  const onJoinVoiceChannel = (channel: ChannelEntity) => {
    dispatch(voiceChannelActions.setFocusedVoiceChannel(channel))
  }
  const onLeaveVoiceChannel = () => {
    dispatch(voiceChannelActions.unsetFocusedVoiceChannel())
  }
  const onCreateChannel = methodsAddChannel.handleSubmit((data) => {
    const createChannelRequest: CreateChannelRequest = {
      serverId: server?.id ?? '',
      name: data.name,
      type: data.type,
    }
    createChannel(createChannelRequest)
    closeModal()
  })
  const hideLeftDiv = () => {
    dispatch(responsiveActions.manageLeftPane())
  }

  return (
    <ChannelsNavigation
      textChannels={channels?.filter(
        (channel) => channel.type === ChannelType.TEXT
      )}
      voiceChannels={channels?.filter(
        (channel) => channel.type === ChannelType.VOICE
      )}
      streamingUsers={streamingUsers ?? []}
      onJoinVoiceChannel={onJoinVoiceChannel}
      onLeaveVoiceChannel={onLeaveVoiceChannel}
      server={server}
      onCreateChannel={onCreateChannel}
      openModal={openModal}
      closeModal={closeModal}
      methodsAddChannel={methodsAddChannel}
      hideLeftDiv={hideLeftDiv}
    />
  )
}
