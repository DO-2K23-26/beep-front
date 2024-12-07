import { Navigate, RouteObject } from 'react-router'
import PageAfterSignupFeature from './feature/page-after-signup-feature'
import PageConfirmEmailFeature from './feature/page-confirm-email-feature'
import { PageEmailUpdateConfirmationFeature } from './feature/page-email-update-confirmation-feature'
import { PageForgotPasswordFeature } from './feature/page-forgot-password-feature'
import { PageResetPasswordFeature } from './feature/page-reset-password-feature'
import { PageSigninFeature } from './feature/page-signin-feature'
import { PageSignupFeature } from './feature/page-signup-feature'
import PageVerifyFeature from './feature/page-verify-feature'
import { PageQRCodeVerifyFeature } from './feature/page-verify-qrcode-feature'
import PageAuthBackground from './ui/page-auth-background'

export const autenticationRouter: RouteObject[] = [
  {
    path: '',
    Component: PageAuthBackground,
    children: [
      {
        index: true,
        element: <Navigate to="signin" replace />,
      },
      {
        path: 'signin',
        Component: PageSigninFeature,
      },
      {
        path: 'signup',
        Component: PageSignupFeature,
      },
      {
        path: 'confirmation',
        Component: PageConfirmEmailFeature,
      },
      {
        path: 'confirmation/email/:token',
        Component: PageEmailUpdateConfirmationFeature,
      },
      {
        path: 'signedup',
        Component: PageAfterSignupFeature,
      },
      {
        path: 'verify/:token',
        Component: PageVerifyFeature,
      },
      {
        path: 'reset-password/:token',
        Component: PageResetPasswordFeature,
      },
      {
        path: 'forgot-password',
        Component: PageForgotPasswordFeature,
      },
      {
        path: 'qrcode/:token',
        Component: PageQRCodeVerifyFeature,
      },
      {
        path: '*',
        element: <Navigate to="signin" replace />,
      },
    ],
  },
]
