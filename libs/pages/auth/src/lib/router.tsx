import { Route } from '@beep/routes'
import { PageLoginFeature } from './feature/page-signin-feature'

export const ROUTER_AUTH: Route[] = [
  {
    path: '/login',
    component: <PageLoginFeature />,
  },
]
