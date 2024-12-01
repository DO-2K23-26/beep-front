import { Navigate, RouteObject } from 'react-router'
import { PageFriendsFeature } from './feature/page-friends-feature'
import { DisplayFriendsFeature } from './feature/display-friends-feature'
import { PageInvitation } from './ui/page-invitation'

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
        Component: PageInvitation,
      },
    ],
  },
]
