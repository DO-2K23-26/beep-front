import {
  ChannelsNavigationFeature,
  MembersNavigationFeature,
} from '@beep/layout'
import { Outlet } from 'react-router'

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface PageServerProps {}

export function PageServer() {
  return (
    <div className="flex flex-row h-dvh w-full justify-between">
      <ChannelsNavigationFeature />
      <div className="flex flex-row w-full h-full bg-violet-200 ">
        <Outlet />
      </div>
      <MembersNavigationFeature />
    </div>
  )
}
