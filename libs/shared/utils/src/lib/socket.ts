import { io } from 'socket.io-client'

export const socket = io(import.meta.env.VITE_WS_BACKEND_URL, {
  autoConnect: false,
  transports: ['websocket'],
  timeout: 5000,
  auth: {
    token: sessionStorage.getItem('accessToken'),
  },
})
