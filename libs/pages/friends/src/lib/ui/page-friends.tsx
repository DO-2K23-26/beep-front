import { Outlet } from 'react-router'
import { HeaderPageFriends } from './header-page-friends'

export function PageFriends() {
  return (
    <div className="flex flex-col h-dvh w-full bg-violet-200 rounded-r-3xl items-start">
      <HeaderPageFriends />
      <Outlet />
    </div>
  )
}
