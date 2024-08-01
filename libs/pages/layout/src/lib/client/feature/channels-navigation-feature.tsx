import { voiceChannelActions } from '@beep/channel'
import {
  ChannelEntity,
  ChannelType,
  CreateChannelRequest,
  UserConnectedEntity,
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
import { getUserState, useGetMeQuery } from '@beep/user'
import {
  getVoiceState,
  setCurrentChannelId,
  setSortedMembers,
} from '@beep/voice'
import { skipToken } from '@reduxjs/toolkit/query'
import { useCallback, useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'react-hot-toast'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router'
import ChannelsNavigation from '../ui/channels-navigation'

export function ChannelsNavigationFeature() {
  const server = useSelector((state: RootState) => state.servers.server)
  const { data: streamingUsers } = useGetCurrentStreamingUsersQuery(
    server?.id ?? ''
  )
  const { remoteStreams, currentChannelId, videoDevice, audioInputDevice } =
    useSelector(getVoiceState)
  const { isMuted, isVoiceMuted, isCamera } = useSelector(getUserState)
  const { data } = useGetMeQuery()

  const dispatch = useDispatch<AppDispatch>()
  const { openModal, closeModal } = useModal()
  const { data: servers } = useGetServersQuery()
  const { data: channels } = useGetServerChannelsQuery(
    server ? server.id : skipToken
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
    TransmitSingleton.subscribe(`servers/${server?.id}/movement`, () => {
      refetch()
    })
  }, [refetch, server])

  const methodsAddChannel = useForm({
    mode: 'onChange',
    defaultValues: {
      name: '',
      type: ChannelType.TEXT,
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
  const hideLeftDiv = () => {
    dispatch(responsiveActions.manageLeftPane())
  }
  const onClickId = async (text: string) => {
    await navigator.clipboard.writeText(text)
    toast.success('Server ID copied to clipboard')
  }

  return (
    <ChannelsNavigation
      onJoinTextChannel={onJoinTextChannel}
      textChannels={channels?.textChannels ?? []}
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
      hideLeftDiv={hideLeftDiv}
    />
  )
}
