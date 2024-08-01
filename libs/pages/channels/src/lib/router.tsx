import { Route } from '@beep/routes'
import { PageMeGeneralFeature } from './feature/page-me-general-feature'
import { PageChannelFeature } from './feature/page-channel-feature'
import { PageInvitation } from './ui/page-invitation'
import { EmptyServerPageFeature } from './feature/empty-server-page-feature'

export const ROUTER_CHANNELS: Route[] = [
  {
    path: '/@me',
    component: <PageMeGeneralFeature />,
  },
  {
    path: '/:serverId',
    component: <EmptyServerPageFeature />,
  },
  { path: '/:serverId/channels/:channelId', component: <PageChannelFeature /> },
  { path: '/invite/:inviteId', component: <PageInvitation /> },
]
