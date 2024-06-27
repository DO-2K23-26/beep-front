import { voiceChannelActions } from '@beep/channel'
import {
  ChannelEntity,
  ChannelType,
  CreateChannelRequest
} from '@beep/contracts'
import { responsiveActions } from '@beep/responsive'
import {
  serverActions,
  useCreateChannelInServerMutation,
  useGetCurrentStreamingUsersQuery,
  useGetServerChannelsQuery,
  useGetServersQuery,
  useJoinVoiceChannelMutation,
  useLeaveVoiceChannelMutation,
} from '@beep/server'
import { AppDispatch, RootState } from '@beep/store'
import { TransmitSingleton } from '@beep/transmit'
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
  const { data: channels } = useGetServerChannelsQuery(server?.id ?? skipToken)

  useEffect(() => {
    if (!server && servers && servers.length > 0) {
      dispatch(serverActions.setServer(servers[0]))
    }
  }, [server, servers, dispatch])

  const [createChannel, resultCreatedChannel] =
    useCreateChannelInServerMutation()
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

  const { refetch } = useGetCurrentStreamingUsersQuery(server?.id ?? '')
  useEffect(() => {
    if (!server?.id) return
    const subscription = TransmitSingleton.getSubscription(`servers/${server?.id}/movement`)
    const unsubscribe = TransmitSingleton.getUnsubscribe(`servers/${server?.id}/movement`)
    if (unsubscribe) {
      unsubscribe()
    }
    const newUnsubscribe = subscription?.onMessage((message) => {
      refetch()
    })
    TransmitSingleton.setUnsubscribe(`servers/${server?.id}/movement`, newUnsubscribe)
  }, [refetch, server])

  const methodsAddChannel = useForm({
    mode: 'onChange',
    defaultValues: {
      name: '',
      type: ChannelType.TEXT,
    },
  })
  const [joinServer] = useJoinVoiceChannelMutation()
  const [leaveServer] = useLeaveVoiceChannelMutation()
  const onJoinVoiceChannel = (channel: ChannelEntity) => {
    if (server?.id) {
      dispatch(
        voiceChannelActions.setFocusedVoiceChannel({
          channel: channel,
          serverId: server.id,
          serverName: server.name,
        })
      )
      joinServer({serverId: server.id, channelId: channel.id})
    }
  }
  const onLeaveVoiceChannel = () => {
    dispatch(voiceChannelActions.unsetFocusedVoiceChannel())
    leaveServer()
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
  const onClickId = (text: string) => {
    navigator.clipboard.writeText(text)
    toast.success('Server ID copied to clipboard')
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
      onClickId={onClickId}
      onCreateChannel={onCreateChannel}
      openModal={openModal}
      closeModal={closeModal}
      methodsAddChannel={methodsAddChannel}
      hideLeftDiv={hideLeftDiv}
    />
  )
}
