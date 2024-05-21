import { createContext, ReactNode, useContext, useEffect } from 'react'
//eslint-disable-next-line
import { socket } from '@beep/utils'
import { Socket } from 'socket.io-client'

export interface EventsProps {
  children?: ReactNode
}

export interface EventsContextType {
  socket: Socket
}

function useSocket() {
  const { socket } = useContext(EventsContext)
  return {
    socket,
  }
}

const EventsContext = createContext<EventsContextType>({
  socket,
})

function Events({ children }: EventsProps) {
  useEffect(() => {
    if (!socket.connected) {
      //make sure that there is only one Event context that connect or disconnect the socket all over the application
      socket.connect()
    }
    return () => {
      if (!socket.disconnected) {
        socket.disconnect()
      }
    }
  }, [])

  return (
    <EventsContext.Provider
      value={{
        socket,
      }}
    >
      {children}
    </EventsContext.Provider>
  )
}

export { Events, EventsContext, useSocket }
