import { voiceChannelActions } from '@beep/channel'
import {
  ChannelEntity,
  ChannelType,
  CreateChannelRequest,
  UserConnectedEntity,
} from '@beep/contracts'
import {
  useCreateChannelInServerMutation,
  useGetCurrentStreamingUsersQuery,
  useGetMyServersQuery,
  useGetServerChannelsQuery,
  useJoinVoiceChannelMutation,
  useLeaveVoiceChannelMutation,
  useTransmitBannerQuery,
} from '@beep/server'
import { AppDispatch } from '@beep/store'
import { sortChannels, TransmitSingleton } from '@beep/transmit'
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
import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate, useParams } from 'react-router'
import ChannelsNavigation from '../ui/channels-navigation'

export function ChannelsNavigationFeature() {
  const { t } = useTranslation()
  const { serverId } = useParams<{ serverId: string }>()
  const { server } = useGetMyServersQuery(undefined, {
    skip: serverId === undefined,
    selectFromResult(state) {
      if (state.data === undefined) return { server: undefined, ...state }
      return {
        server: state.data.find((server) => server.id === serverId),
        ...state,
      }
    },
  })

  const { data: streamingUsers } = useGetCurrentStreamingUsersQuery(
    server?.id ?? ''
  )
  const { remoteStreams, currentChannelId, videoDevice, audioInputDevice } =
    useSelector(getVoiceState)
  const { isMuted, isVoiceMuted, isCamera } = useSelector(getUserState)
  const { data } = useGetMeQuery()

  const dispatch = useDispatch<AppDispatch>()
  const { openModal, closeModal } = useModal()
  const { data: channels } = useGetServerChannelsQuery(
    server ? server.id : skipToken
  )

  const { currentData: banner } = useTransmitBannerQuery(
    server?.id ?? skipToken,
    {
      skip: server?.banner === undefined || server?.banner === '',
    }
  )

  const [joinServer] = useJoinVoiceChannelMutation()
  const [leaveServer] = useLeaveVoiceChannelMutation()

  const navigate = useNavigate()

  useEffect(() => {
    //match the received streams with the users connected in the channel and filter them if the user want it
    const filteredUserStreamsAssociation: {
      user: UserConnectedEntity
      stream: MediaStream
    }[] = []
    remoteStreams.map((stream) => {
      const usersChannel = streamingUsers?.find(
        (value) => value.channelId === currentChannelId
      )
      return usersChannel?.users?.map((currentUser) => {
        //the mid is composed like this userSerialNumber + '-' + id of track (incremental number)
        if (
          stream.mid?.substring(0, stream.mid?.length - 2) ===
          currentUser.userSn
        ) {
          const toEdit = filteredUserStreamsAssociation.find(
            (entity) => entity.user.id === currentUser.id
          )
          if (toEdit === undefined) {
            filteredUserStreamsAssociation.push({
              user: currentUser,
              stream: new MediaStream([stream.receiver.track]),
            })
          } else {
            toEdit.stream.addTrack(stream.receiver.track)
          }
        }
        return stream
      })
    })
    filteredUserStreamsAssociation.filter((entity) => {
      if (!entity.user.camera && entity.user.id !== data?.id) {
        entity.stream
          .getVideoTracks()
          .map((video) => entity.stream.removeTrack(video))
      }
      if (entity.user.voiceMuted || isMuted) {
        entity.stream
          .getAudioTracks()
          .map((audio) => entity.stream.removeTrack(audio))
      }
      return entity
    })
    dispatch(setSortedMembers(filteredUserStreamsAssociation))
  }, [
    streamingUsers,
    remoteStreams,
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
  }, [resultCreatedChannel, t])

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
      const token = await joinServer({
        serverId: server.id,
        channelId: channel.id,
        userState: {
          muted: isMuted,
          voiceMuted: isVoiceMuted,
          camera: isCamera,
        },
      })
      dispatch(setCurrentChannelId(channel.id))
      dispatch({
        type: 'INITIALIZE_WEBRTC',
        payload: {
          token: token,
          videoDevice: videoDevice,
          audioInputDevice: audioInputDevice,
          isVoiceMuted: isVoiceMuted,
          isCamera: isCamera,
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

  const textChannels = sortChannels(channels)

  return (
    <ChannelsNavigation
      key={'server_' + server?.id}
      onJoinTextChannel={onJoinTextChannel}
      textChannels={textChannels}
      voiceChannels={channels?.voiceChannels ?? []}
      streamingUsers={streamingUsers ?? []}
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
