import { useEffect } from 'react'
import { useSocket } from './events'

interface SocketEventProps {
  event: string
  handler: (...args: []) => void
}

function SocketEvent({ event, handler }: SocketEventProps): null {
  const { socket } = useSocket()
  useEffect(() => {
    socket?.on(event, handler)
    return () => {
      socket?.off(event, handler)
    }
  }, [socket, event, handler])
  return null
}

export { SocketEvent }
