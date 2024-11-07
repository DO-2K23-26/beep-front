import { Route } from '@beep/routes'
import PageAfterSignupFeature from './feature/page-after-signup-feature'
import PageConfirmEmailFeature from './feature/page-confirm-email-feature'
import { PageEmailUpdateConfirmationFeature } from './feature/page-email-update-confirmation-feature'
import { PageSigninFeature } from './feature/page-signin-feature'
import { PageSignupFeature } from './feature/page-signup-feature'
import { PageVerifyFeature } from './feature/page-verify-feature'
import { PageResetPasswordFeature } from './feature/page-reset-password-feature'
import { PageForgotPasswordFeature } from './feature/page-forgot-password-feature'
import PageQRCodeVerify from './ui/page-verify-qrcode'
import { PageQRCodeVerifyFeature } from './feature/page-verify-qrcode-feature'

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
    path: '/confirmation/email/:token',
    component: <PageEmailUpdateConfirmationFeature />,
  },
  {
    path: '/signedup',
    component: <PageAfterSignupFeature />,
  },
  {
    path: '/verify/:token',
    component: <PageVerifyFeature />,
  },
  {
    path: '/reset-password/:token',
    component: <PageResetPasswordFeature />,
  },
  {
    path: '/forgot-password',
    component: <PageForgotPasswordFeature />,
  },
  {
    path: '/qrcode/:token',
    component: <PageQRCodeVerifyFeature />,
  }
]
