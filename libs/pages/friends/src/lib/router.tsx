import { Navigate, RouteObject } from 'react-router'
import { DisplayFriendsFeature } from './feature/display-friends-feature'
import { PageFriendsFeature } from './feature/page-friends-feature'
import { PageInvitationFeature } from './feature/page-invitation-feature'

export const friendRoutes: RouteObject[] = [
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
]
