import { Route, Routes } from 'react-router-dom'
import { ROUTER_CHANNELS } from './router'
import { VoiceChat } from './ui/voice-chat';

export function PageChannels() {
  return (
    <>
    <VoiceChat/>
    <Routes>
      {ROUTER_CHANNELS.map((route) => (
        <Route key={route.path} path={route.path} element={route.component} />
      ))}
    </Routes>
    </>
  )
}
