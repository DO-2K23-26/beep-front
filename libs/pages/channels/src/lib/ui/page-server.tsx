import {
  ChannelsNavigationFeature,
  MembersNavigationFeature,
} from '@beep/layout'
import { leftPaneState, rightPaneState } from '@beep/responsive'
import { cn } from '@beep/utils'
import { useSelector } from 'react-redux'
import { Outlet } from 'react-router'

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface PageServerProps {}

export function PageServer() {
  const rightDivState = useSelector(rightPaneState)
  const leftDivState = useSelector(leftPaneState)

  return (
    <div className={cn('flex flex-row h-dvh w-full justify-start')}>
      <div className={cn({ 'w-1/3 sm:w-fit': leftDivState })}>
        <ChannelsNavigationFeature />
      </div>

      <div
        className={cn('h-full w-full bg-violet-200 ', {
          'rounded-none md:rounded-r-3xl xl:rounded-none': !rightDivState,
          'rounded-r-2xl sm:rounded-none': rightDivState,
          'w-2/3 sm:w-full ': leftDivState,
        })}
      >
        <Outlet />
      </div>
        <MembersNavigationFeature />
    </div>
  )
}