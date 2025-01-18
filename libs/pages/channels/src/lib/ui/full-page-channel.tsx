import { Outlet } from 'react-router'
import { HeaderPageFeature } from '../feature/header-page-channel-feature'
import { useContext } from 'react'
import { ServerContext } from '../feature/page-server-feature'
import { Permissions } from '@beep/contracts'
export function FullPageChannel() {
  const { myMember } = useContext(ServerContext)
  return (
    <div className="flex flex-col w-full p-2 md:p-4 gap-2 md:gap-4 justify-between h-dvh">
      <HeaderPageFeature />
      <Outlet />
    </div>
  )
}
