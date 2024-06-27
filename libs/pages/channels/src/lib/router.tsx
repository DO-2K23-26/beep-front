import { Route } from '@beep/routes'
import { PageMeGeneralFeature } from './feature/page-me-general-feature'
import { PageChannelFeature } from './feature/page-channel-feature'
import { PageInvitation } from './ui/page-invitation'

export const ROUTER_CHANNELS: Route[] = [
  {
    path: '/@me',
    component: <PageMeGeneralFeature />,
  },
  { path: '/:serverId/channels/:channelId', component: <PageChannelFeature /> },
  { path: '/invite/:inviteId', component: <PageInvitation /> },
]
