import { ChannelEntity } from '@beep/contracts'
import { CurrentUserFeature } from '@beep/layout'
import { leftPaneState } from '@beep/responsive'
import { cn } from '@beep/utils'
import { useSelector } from 'react-redux'
import { Outlet } from 'react-router-dom'
import { DisplayPrivateChannels } from './display-private-channels'

interface FriendsNavigationProps {
  channels: ChannelEntity[]
}

// NOT USED FOR THE MOMENT 10/11/2024

export function PageFriendsChannel({ channels }: FriendsNavigationProps) {
  const leftDivState = useSelector(leftPaneState)
  return (
    <div className="flex flex-row w-full bg-violet-200 rounded-r-3xl">
      <div
        className={cn('flex flex-row h-full w-fit transition-all', {
          'hidden md:flex': !leftDivState,
        })}
      >
        <div className="flex flex-col items-center px-0 sm:px-1 bg-violet-300 h-full justify-between">
          <DisplayPrivateChannels channels={channels} />
          <div className="p-2">
            <CurrentUserFeature />
          </div>
        </div>
      </div>
      <div className={cn('flex flex-grow')}>
        <Outlet />
      </div>
    </div>
  )
}
