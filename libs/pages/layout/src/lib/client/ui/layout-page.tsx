import { getResponsiveState } from '@beep/responsive'
import { Button, ButtonStyle, Icon } from '@beep/ui'
import { PropsWithChildren, useId } from 'react'
import { useSelector } from 'react-redux'
import ChannelsNavigationFeature from '../feature/channels-navigation-feature'
import MembersListFeature from '../feature/members-navigation-feature'
import ServersNavigationFeature from '../feature/servers-navigation-feature'

export interface LayoutPageProps {
  hideRightDiv?: () => void
}

export default function LayoutPage({
  children,
  hideRightDiv,
}: PropsWithChildren<LayoutPageProps>) {
  const id: string = useId();
  const { showRightPane, showLeftPane } = useSelector(getResponsiveState)

  return (
    <div className="h-screen flex bg-violet-500">
      {/* Left channels navigation pane */}
      <ChannelsNavigationFeature />

      {/* Chat content */}
      <div key={id} className={showLeftPane || showRightPane ? 'hidden' : 'flex w-full'}>
        {children}
      </div>

      {/* Right members & servers navigation pane */}
      <div className={showRightPane ? 'flex abolute w-full' : 'hidden lg:flex'}>
        {/* Responsive button */}
        <div className="p-6 bg-violet-200 lg:hidden">
          <Button
            style={ButtonStyle.SQUARE}
            onClick={hideRightDiv}
            className="!bg-violet-300"
          >
            <Icon name="lucide:user" className="w-4 h-4" />
          </Button>
        </div>
        <MembersListFeature />
        <ServersNavigationFeature />
      </div>
    </div>
  )
}
