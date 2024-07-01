import { ReactElement } from 'react'
import { PageAuth } from '@beep/pages/auth'
import { PageChannels } from '@beep/pages/channels'
import {
  ChannelsNavigationFeature,
  MembersNavigationFeature,
  ServersNavigationFeature,
} from '@beep/layout'
import { PageDiscover } from '@beep/discover'

interface LayoutProps {
  leftPanel: ReactElement
  rightPanel: ReactElement
}

interface RouteProps {
  path: string
  component: ReactElement
  layout: LayoutProps | null
}

export const ROUTER: RouteProps[] = [
  {
    path: '/authentication/*',
    component: <PageAuth />,
    layout: null,
  },
  {
    path: '/servers/*',
    component: <PageChannels />,
    layout: {
      leftPanel: <ChannelsNavigationFeature />,
      rightPanel: (
        <>
          <MembersNavigationFeature />
          <ServersNavigationFeature />
        </>
      ),
    },
  },
  {
    path: '/discover',
    component: <PageDiscover />,
    layout: {
      leftPanel: <></>,
      rightPanel: <ServersNavigationFeature />,
    },
  },
]
