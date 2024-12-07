import { Outlet } from 'react-router'
import { HeaderPageFeature } from '../feature/header-page-channel-feature'

export function FullPageChannel() {
  return (
    <div className="flex flex-col w-full p-2 md:p-4 gap-2 md:gap-4 justify-between h-dvh">
      <HeaderPageFeature />
      <Outlet />
    </div>
  )
}
