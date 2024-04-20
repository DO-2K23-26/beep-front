import { ChannelEntity, UserEntity } from '@beep/contracts'
import { PropsWithChildren } from 'react'
import ChannelsNavigationFeature from '../feature/channels-navigation-feature'
import MembersListFeature from '../feature/members-navigation-feature'
import ServersNavigationFeature from '../feature/servers-navigation-feature'

export interface LayoutPageProps {
  channels?: ChannelEntity[]
  users?: UserEntity[]
}

export default function LayoutPage({
  children,
}: PropsWithChildren<LayoutPageProps>) {
  return (
    <div className="h-screen flex bg-violet-500">
      <ChannelsNavigationFeature />

      {/* <div
        className={
          isLeftDivVisible || isRightDivVisible
            ? 'hidden'
            : 'bg-violet-200 w-full p-6 flex flex-col gap-6 justify-between h-[100dvh]'
        }
      > */}
      <div className="flex w-full">{children}</div>

      {/* <div
        className={isRightDivVisible ? 'flex abolute w-full' : 'hidden lg:flex'}
      > */}
      <div className="hidden lg:flex">
        <MembersListFeature />
        <ServersNavigationFeature />
      </div>
    </div>
  )
}
