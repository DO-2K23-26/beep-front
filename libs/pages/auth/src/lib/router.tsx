import { Route } from '@beep/routes'
import { PageSigninFeature } from './feature/page-signin-feature'
import { PageSignupFeature } from './feature/page-signup-feature'

export const ROUTER_AUTH: Route[] = [
  {
    path: '/signin',
    component: <PageSigninFeature />,
  },
  {
    path: '/signup',
    component: <PageSignupFeature />,
  },
]
