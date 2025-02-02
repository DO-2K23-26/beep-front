import { voiceChannelActions } from "@beep/channel"
import { getUserState, useGetMeQuery } from "@beep/user"
import { ChannelEntity, OccupiedChannelEntity, ServerEntity } from "@beep/contracts"
import { useGetServerChannelsQuery } from '@beep/server'
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

  const { isScreenShared, isVoiceMuted, isCamera } = useSelector(getUserState)

  const { data: channels } = useGetServerChannelsQuery(
    server ? server.id : skipToken
  )

  useEffect(() => {
    if (server && channels?.voiceChannels && me?.id) {
      dispatch({
        type: 'INITIALIZE_PRESENCE',
        payload: {
          channels: channels?.voiceChannels.map((channel) => channel.id),
          server: server?.id,
          id: me?.id,
        },
      })
    }
  }, [server, channels?.voiceChannels, dispatch, me?.id])

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
      })    }
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
