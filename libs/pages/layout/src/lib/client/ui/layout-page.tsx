import { PropsWithChildren } from 'react'
import { ChannelEntity, UserEntity } from '@beep/contracts'
import { Navigation } from './channel-navigation'

export interface LayoutPageProps {
  channels?: ChannelEntity[]
  users?: UserEntity[]
}

export function LayoutPage({
  children,
  channels = [],
  users,
}: PropsWithChildren<LayoutPageProps>) {
  return (
    <div className="h-screen">
      <div className="grid grid-cols-5 h-full">
        <div className="bg-purple col-span-1">
          <Navigation channels={channels} />
        </div>

        <div className="bg-lightpurple col-span-3">{children}</div>

        <div className="bg-purple col-span-1">
          <div className="flex flex-col">
            {users?.map((user, index) => (
              <div className="" key={index}>
                <span>{user.id}</span>
              </div>
            ))}
          </div>

          {/*<MembersList allUsers={allUsers} connectedUsers={connectedUsers} />*/}
        </div>
      </div>
    </div>
  )
}

export default LayoutPage
