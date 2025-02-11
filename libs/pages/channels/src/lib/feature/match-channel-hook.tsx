import { voiceChannelActions } from "@beep/channel"
import { getUserState, useGetMeQuery } from "@beep/user"
import { ChannelEntity, ChannelType, OccupiedChannelEntity, ServerEntity } from "@beep/contracts"
import { useGetServerChannelsQuery, useJoinVoiceChannelMutation } from '@beep/server'
import { AppDispatch } from "@beep/store"
import {
  associateUsersToStreams,
  getVoiceState, initializeDevices,
  setCurrentChannelId,
  setNeedConnection,
  setSortedMembers
} from '@beep/voice'
import { useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import { unwrapResult } from '@reduxjs/toolkit'
import { skipToken } from '@reduxjs/toolkit/query'
import { useNavigate } from 'react-router'

interface VoiceChannelsReturn {
  onJoinVoiceChannel: (channel: ChannelEntity) => void
  onLeaveVoiceChannel: () => void
}

export function useVoiceChannels({
  streamingUsers,
  server
}: {
  streamingUsers: OccupiedChannelEntity[] | undefined,
  server: ServerEntity | undefined
}): VoiceChannelsReturn {

  const dispatch = useDispatch<AppDispatch>()
  const { data: me } = useGetMeQuery()
  const { remoteStreams, currentChannelId, videoDevice, audioInputDevice, userStreams, serverPresence, needConnection } =
    useSelector(getVoiceState)
  const navigate = useNavigate()
  const [join, data] = useJoinVoiceChannelMutation()

  const { isScreenShared, isVoiceMuted, isCamera } = useSelector(getUserState)

  const { data: channels } = useGetServerChannelsQuery(
    server ? server.id : skipToken
  )

  const presence = async (serverId: string, id: string, channels: ChannelEntity[]) => {
    console.log('Joining voice channel', data)
    await join({
      serverId: serverId,
      channelId: channels && channels.length > 0 ? channels[0].id : 'null',
      userState: { muted: true, voiceMuted: true, camera: true }
    })
  }

  useEffect(() => {
    if (data.isSuccess) {
      const voiceChannels: ChannelEntity[] = []
      const getVoiceChannel = (channelsLevel: ChannelEntity[]) => {
        for (const channel of channelsLevel) {
          if (channel.type === ChannelType.voice_server) {
            voiceChannels.push(channel)
          } else if (channel.type === ChannelType.folder) {
            getVoiceChannel(channel.childrens ? channel.childrens : [])
          }
        }
      }

      getVoiceChannel(channels ? channels : [])
      if (server && voiceChannels && me?.id) {
        dispatch({
          type: 'INITIALIZE_PRESENCE',
          payload: {
            channels: voiceChannels.map((channel) => channel.id),
            server: server?.id,
            id: me?.id,
            token: data.data?.token,
          },
        })
      }
    }
  }, [data])

  useEffect(() => {
    const voiceChannels: ChannelEntity[] = []
    const getVoiceChannel = (channelsLevel: ChannelEntity[]) => {
      for (const channel of channelsLevel) {
        if (channel.type === ChannelType.voice_server) {
          voiceChannels.push(channel)
        } else if (channel.type === ChannelType.folder) {
          getVoiceChannel(channel.childrens ? channel.childrens : [])
        }
      }
    }

    getVoiceChannel(channels ? channels : [])
    if (server && voiceChannels && me?.id) {
      presence(server.id, me?.id, voiceChannels)
    }
  }, [server, dispatch, me?.id, channels])

  useEffect(() => {
    if (server && me && currentChannelId && needConnection && (videoDevice || audioInputDevice)) {
      dispatch(setNeedConnection(false))
      dispatch({
        type: 'INITIALIZE_WEBRTC',
        payload: {
          server: server.id,
          channel: currentChannelId,
          token: me.id,
          videoDevice: videoDevice,
          audioInputDevice: audioInputDevice,
          isVoiceMuted: isVoiceMuted,
          isCamera: isCamera,
          username: me.username,
        },
      })
    }
  }, [needConnection, dispatch, audioInputDevice, videoDevice, currentChannelId, server?.id, me?.id, me?.username, isVoiceMuted, isCamera])

  const onJoinVoiceChannel = async (channel: ChannelEntity) => {
    if (server?.id) {
      const resultAction = await dispatch(initializeDevices())
      dispatch(
        voiceChannelActions.setFocusedVoiceChannel({
          channel: channel,
          serverId: server.id,
          serverName: server.name,
        })
      )
      unwrapResult(resultAction)
      dispatch(setCurrentChannelId(channel.id))
      dispatch(setNeedConnection(true))
      navigate(`/servers/${server.id}/channels/voice`)
    }
  }

  const onLeaveVoiceChannel = () => {
    dispatch(voiceChannelActions.unsetFocusedVoiceChannel())
    dispatch({ type: 'CLOSE_WEBRTC' })
  }

  useEffect(() => {
    //match the received streams with the users connected in the channel and filte
    if (streamingUsers === undefined) {
      dispatch(setSortedMembers([])) // no user founds
      return
    }
    if (me === undefined) {
      dispatch(setSortedMembers([])) // no user founds
      return
    }
    dispatch(setSortedMembers(associateUsersToStreams(
      {
        currentUser: me,
        streamingUsers,
        remoteStreams,
        userStreams,
        serverPresence,
        currentChannelId,
        isScreenShared,
      }
    )))
  }, [streamingUsers, remoteStreams, isCamera, currentChannelId, me, isScreenShared, dispatch, userStreams, serverPresence])

  return {
    onJoinVoiceChannel,
    onLeaveVoiceChannel
  }
}
