import { Route } from '@beep/routes'
import { PageSigninFeature } from './feature/page-signin-feature'
import { PageSignupFeature } from './feature/page-signup-feature'
import PageConfirmEmailFeature from './feature/page-confirm-email-feature'
import PageAfterSignupFeature from './feature/page-after-signup-feature'
import { PageVerifyFeature } from './feature/page-verify-feature'

export const ROUTER_AUTH: Route[] = [
  {
    path: '/signin',
    component: <PageSigninFeature />,
  },
  {
    path: '/signup',
    component: <PageSignupFeature />,
  },
  {
    path: '/confirmation',
    component: <PageConfirmEmailFeature />,
  },
  {
    path: '/signedup',
    component: <PageAfterSignupFeature />,
  },
  {
    path: '/verify/:token',
    component: <PageVerifyFeature />
  }
  // {
  //   path: '/forget-password',
  // }
]
