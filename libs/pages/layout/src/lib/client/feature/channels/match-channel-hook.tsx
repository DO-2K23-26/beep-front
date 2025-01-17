import { voiceChannelActions } from "@beep/channel"
import { getUserState, useGetMeQuery } from "@beep/user"
import { ChannelEntity, OccupiedChannelEntity, ServerEntity } from "@beep/contracts"
import { useJoinVoiceChannelMutation, useLeaveVoiceChannelMutation } from "@beep/server"
import { AppDispatch } from "@beep/store"
import { associateUsersToStreams, getVoiceState, setCurrentChannelId, setSortedMembers } from "@beep/voice"
import { useCallback, useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"

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
  const { remoteStreams, currentChannelId, videoDevice, audioInputDevice } =
    useSelector(getVoiceState)

  const { isMuted, isVoiceMuted, isCamera } = useSelector(getUserState)
  const [joinServer] = useJoinVoiceChannelMutation()


  const [leaveServer] = useLeaveVoiceChannelMutation()


  const handleReload = useCallback(() => {
    leaveServer()
  }, [leaveServer])

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
        currentChannelId,
        isMuted,
      }
    )))
  }, [
    streamingUsers,
    remoteStreams,
    isCamera,
    currentChannelId,
    me,
    isMuted,
    dispatch,
  ])

  return {
    onJoinVoiceChannel,
    onLeaveVoiceChannel
  }
}
