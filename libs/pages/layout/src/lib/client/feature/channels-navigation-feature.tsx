import { voiceChannelActions } from '@beep/channel'
import {
  ChannelEntity,
  ChannelType,
  CreateChannelRequest,
  UserConnectedEntity,
} from '@beep/contracts'
import {
  serverActions,
  useCreateChannelInServerMutation,
  useGetCurrentStreamingUsersQuery, useGetMyServersQuery,
  useGetServerChannelsQuery,
  useLeaveVoiceChannelMutation, useTransmitBannerQuery
} from '@beep/server'
import { AppDispatch, RootState } from '@beep/store'
import { TransmitSingleton } from '@beep/transmit'
import { useModal } from '@beep/ui'
import { getUserState, useGetMeQuery } from '@beep/user'
import {
  getVoiceState,
  setCurrentChannelId,
  setSortedMembers,
} from '@beep/voice'
import { skipToken } from '@reduxjs/toolkit/query'
import { useCallback, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'react-hot-toast'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router'
import ChannelsNavigation from '../ui/channels-navigation'
import { useTranslation } from 'react-i18next'

export function ChannelsNavigationFeature() {
  const { t } = useTranslation()

  const server = useSelector((state: RootState) => state.servers.server)
  const { data: streamingUsers } = useGetCurrentStreamingUsersQuery(
    server?.id ?? ''
  )
  const { remoteStreams, currentChannelId, videoDevice, audioInputDevice, userStreams, serverPresence } =
    useSelector(getVoiceState)
  const { isMuted, isVoiceMuted, isCamera } = useSelector(getUserState)
  const { data } = useGetMeQuery()

  const dispatch = useDispatch<AppDispatch>()
  const { openModal, closeModal } = useModal()
  const { data: servers } = useGetMyServersQuery()
  const { data: channels } = useGetServerChannelsQuery(
    server ? server.id : skipToken
  )

  const { currentData: banner } = useTransmitBannerQuery(
    server?.id ?? skipToken,
    {
      skip: server?.banner === undefined || server?.banner === '',
    }
  )


  //const [joinServer] = useJoinVoiceChannelMutation()
  const [leaveServer] = useLeaveVoiceChannelMutation()

  const navigate = useNavigate()

  useEffect(() => {
    if (server) {
      dispatch({
        type: 'INITIALIZE_PRESENCE',
        payload: {
          channels: channels?.voiceChannels.map((channel) => channel.id),
          server: server?.id,
          id: data?.id,
        },
      })
    }
  }, [server])

  useEffect(() => {
    //match the received streams with the users connected in the channel and filter them if the user want it
    const filteredUserStreamsAssociation: {
      user: UserConnectedEntity
      stream: MediaStream
    }[] = []
    const usersChannel = serverPresence?.find(
      (value) => value.channelId === currentChannelId
    )
    console.log(JSON.stringify(usersChannel), JSON.stringify(serverPresence))
    userStreams.map((userStream) => {
      const userchan = usersChannel?.users?.find((userchan) => userchan.id === userStream.id && data?.id !== userStream.id)
      if (userchan) {
        const userbis = {...userchan}
        const stream = new MediaStream()
        if (userStream.audio !== null){
          userbis.muted = false
          userbis.voiceMuted = false
          const audioTranceiver = remoteStreams.find((stream) => stream.receiver.track.id === userStream.audio)
          if(audioTranceiver){
            stream.addTrack(audioTranceiver.receiver.track)
          }
        }
        if (userStream.video !== null){
          userbis.camera = true
          const videoTrack = remoteStreams.find((stream) => stream.receiver.track.id === userStream.video)
          if (videoTrack){
            stream.addTrack(videoTrack.receiver.track)
          }
        }
        filteredUserStreamsAssociation.push({
          user: userbis,
          stream: stream,
        }
      )
      }
      console.log("streams assotiation", filteredUserStreamsAssociation, filteredUserStreamsAssociation[0]?.stream.getTracks())
      console.log("tracks", remoteStreams)
    })
    dispatch(setSortedMembers(filteredUserStreamsAssociation))
  }, [
    streamingUsers,
    remoteStreams,
    userStreams,
    isCamera,
    currentChannelId,
    data?.id,
    dispatch,
  ])

  const handleReload = useCallback(() => {
    leaveServer()
  }, [leaveServer])

  useEffect(() => {
    window.addEventListener('beforeunload', handleReload)
    window.addEventListener('unload', handleReload)

    // Clean up the event listeners on component unmount
    return () => {
      window.removeEventListener('beforeunload', handleReload)
      window.removeEventListener('unload', handleReload)
    }
  }, [handleReload]) // Make sure to include any dependencies if your leaveServer function depends on props or state

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
      toast.success(t('layout.channels-navigation.success_create_channel'))
    } else if (resultCreatedChannel.isError) {
      toast.error(t('layout.channels-navigation.error_create_channel'))
    }
  }, [resultCreatedChannel])

  const { refetch } = useGetCurrentStreamingUsersQuery(server?.id ?? '')
  useEffect(() => {
    if (!server?.id) return
    TransmitSingleton.subscribe(`servers/${server?.id}/movement`, () => {
      refetch()
    })
  }, [refetch, server])

  const methodsAddChannel = useForm({
    mode: 'onChange',
    defaultValues: {
      name: '',
      type: ChannelType.text_server,
    },
  })

  const onJoinTextChannel = (serverId: string, channelId: string) => {
    navigate(`/servers/${serverId}/channels/${channelId}`)
  }

  const onJoinVoiceChannel = async (channel: ChannelEntity) => {
    if (server?.id) {
      dispatch(
        voiceChannelActions.setFocusedVoiceChannel({
          channel: channel,
          serverId: server.id,
          serverName: server.name,
        })
      )
      // const token = await joinServer({
      //   serverId: server.id,
      //   channelId: channel.id,
      //   userState: {
      //     muted: isMuted,
      //     voiceMuted: isVoiceMuted,
      //     camera: isCamera,
      //   },
      // })
      dispatch(setCurrentChannelId(channel.id))
      dispatch({
        type: 'INITIALIZE_WEBRTC',
        payload: {
          server: server.id,
          channel: channel.id,
          token: data?.id,
          videoDevice: videoDevice,
          audioInputDevice: audioInputDevice,
          isVoiceMuted: isVoiceMuted,
          isCamera: isCamera,
          username: data?.username
        },
      })
    }
  }
  const onLeaveVoiceChannel = () => {
    dispatch(voiceChannelActions.unsetFocusedVoiceChannel())
    leaveServer()
    dispatch({ type: 'CLOSE_WEBRTC' })
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
  const onClickId = async (text: string) => {
    await navigator.clipboard.writeText(text)
    toast.success(t('layout.channels-navigation.copy_server_id'))
  }

  return (
    <ChannelsNavigation
      key={'server_' + server?.id}
      onJoinTextChannel={onJoinTextChannel}
      textChannels={channels?.textChannels ?? []}
      voiceChannels={channels?.voiceChannels ?? []}
      streamingUsers={serverPresence ?? []}
      onJoinVoiceChannel={onJoinVoiceChannel}
      onLeaveVoiceChannel={onLeaveVoiceChannel}
      server={server}
      onClickId={onClickId}
      onCreateChannel={onCreateChannel}
      openModal={openModal}
      closeModal={closeModal}
      methodsAddChannel={methodsAddChannel}
      banner={server?.banner !== '' ? banner : undefined}
    />
  )
}
