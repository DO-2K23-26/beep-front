import {
  PageChannelFeature
} from '@beep/pages/channels'
import { Navigate, RouteObject } from 'react-router'
import { DisplayFriendsFeature } from './feature/display-friends-feature'
import { PageFriendsFeature } from './feature/page-friends-feature'
import { PageInvitationFeature } from './feature/page-invitation-feature'
import { PagePrivateChannelFeature } from './feature/page-private-channel-feature'
import { PrivateChannelsNavigationFeature } from './feature/private-channels-navigation-feature'

export const friendRoutes: RouteObject[] = [
  {
    path: '',
    Component: PrivateChannelsNavigationFeature,
    children: [
      {
        path: '',
        Component: PageFriendsFeature,
        children: [
          {
            index: true,
            element: <Navigate to="all" replace />,
          },
          {
            path: 'all',
            Component: DisplayFriendsFeature,
          },
          {
            path: 'invitations',
            Component: PageInvitationFeature,
          },
        ],
      },
      {
        path: '',
        Component: PagePrivateChannelFeature,
        children: [
          {
            index: true,
            element: <Navigate to="all" replace />,
          },
          {
            path: ':channelId',
            Component: PageChannelFeature,
          },
        ],
      },
    ],
  },
]
