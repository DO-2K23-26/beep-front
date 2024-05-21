import { useSelector } from 'react-redux'
import { LocalFeed } from './local-feed'
import { getChannelsState, useGetConnectedUsersQuery } from '@beep/channel'
import { getUserState } from '@beep/user'
import { socket } from '@beep/utils'
import { RemoteFeed } from './remote-feed'
import { useEffect } from 'react'

export function VoiceChat() {
  const channels = useSelector(getChannelsState)
  const connectedUsers = useGetConnectedUsersQuery()
  const { payload } = useSelector(getUserState)
  useEffect(() => {
    socket.on('usermove', connectedUsers.refetch)
    return () => {
      socket.off('usermove', connectedUsers.refetch)
    }
  }, [connectedUsers])
  if (!channels.focusedChannel.id) {
    return null
  }
  console.log('Focused channel', connectedUsers)
  const connectedUsersOnChannnel = connectedUsers.data
    ?.filter(
      (channel) => channel.channelId === channels.focusedChannel.id.toString()
    )[0]
    ?.users.filter((user) => user.id !== payload?.sub.toString())

  console.log('Connected users', connectedUsersOnChannnel)

  if (!connectedUsersOnChannnel || connectedUsersOnChannnel === undefined) {
    return null
  }
  return (
    <>
      <LocalFeed
        channelId={channels.focusedChannel.id}
        username="Me"
        sendData={(e) => {
          socket.emit('audio', {
            audio: e.data,
            channel_id: channels.focusedChannel.id,
          })
        }}
      />
      {connectedUsersOnChannnel.map((user) => {
        return <RemoteFeed key={user.id} member={user} />
      })}
    </>
  )
}
