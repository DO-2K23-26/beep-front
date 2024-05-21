import { Events, SocketEvent } from '@beep/events'
import { getServersState, useGetCurrentStreamingUsersQuery } from '@beep/server'
import { useSelector } from 'react-redux'

export function ChannelEvents(): JSX.Element {
  const server = useSelector(getServersState)
  const { data: connectedUserData, refetch: refetchConnectedUsers } =
    useGetCurrentStreamingUsersQuery(server.server?.id || '0') //TODO better error handling but I dont have the time, I should be working on streaming
  return (
    <Events>
      <SocketEvent
        event="usermove"
        handler={() => {
          refetchConnectedUsers()
        }}
      />
    </Events>
  )
}
