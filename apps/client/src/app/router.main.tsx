import { ReactElement } from 'react'
import { PageAuth } from '@beep/pages/auth'
import { PageChannels } from '@beep/pages/channels'

interface RouteProps {
  path: string
  component: ReactElement
  layout: boolean
}

export const ROUTER: RouteProps[] = [
  {
    path: '/authentication/*',
    component: <PageAuth />,
    layout: false,
  },
  {
    path: '/channels/*',
    component: <PageChannels />,
    layout: true,
  },
]
