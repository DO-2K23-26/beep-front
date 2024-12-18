import { Outlet } from 'react-router'
import { HeaderPrivateChannel } from './header-private-channel'

// eslint-disable-next-line @typescript-eslint/no-empty-interface
interface PagePrivateChannelProps {}

export function PagePrivateChannel() {
  return (
    <div className="flex flex-col w-full p-2 md:p-4 gap-2 md:gap-4 justify-between h-full">
      <HeaderPrivateChannel />
      <Outlet />
    </div>
  )
}
