import { Route, Routes } from 'react-router-dom'
import { ROUTER_CHANNELS } from './router'

export function PageChannels() {
  return (
    <>
      <Routes>
        {ROUTER_CHANNELS.map((route) => (
          <Route key={route.path} path={route.path} element={route.component} />
        ))}
      </Routes>
    </>
  )
}
