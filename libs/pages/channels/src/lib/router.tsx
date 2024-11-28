import { PageDiscover } from '@beep/discover'
import { Navigate, RouteObject } from 'react-router'
import { EmptyServerPageFeature } from './feature/empty-server-page-feature'
import { FullPageChannelFeature } from './feature/full-page-channel-feature'
import { PageChannelFeature } from './feature/page-channel-feature'
import { PageServerFeature } from './feature/page-server-feature'
import { PageInvitation } from './ui/page-invitation'

export const serverRoutes: RouteObject[] = [
  {
    path: '',
    children: [
      {
        index: true,
        element: <Navigate to="discover" replace />,
      },
      {
        path: 'discover',
        Component: PageDiscover,
      },
      {
        path: 'invite/:inviteId',
        Component: PageInvitation,
      },
      {
        path: ':serverId',
        Component: PageServerFeature,
        children: [
          {
            index: true,
            element: <Navigate to="channels" replace />,
          },

          {
            path: 'channels',
            Component: FullPageChannelFeature,
            children: [
              {
                path: '',
                Component: EmptyServerPageFeature,
              },
              {
                path: ':channelId',
                Component: PageChannelFeature,
              },
              {
                path: '*',
                element: <Navigate to="/servers/discover" />,
              },
            ],
          },
          {
            path: '*',
            element: <Navigate to="/servers/discover" replace />,
          },
        ],
      },
    ],
  },
]
