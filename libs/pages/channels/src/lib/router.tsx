import { Route } from '@beep/routes';
import { PageMeGeneralFeature } from './feature/page-me-general-feature';
import { PageChannelFeature } from './feature/page-channel-feature';

export const ROUTER_CHANNELS: Route[] = [
  {
    path: '/@me',
    component: <PageMeGeneralFeature />,
  },

  { path: '/:channelId', component: <PageChannelFeature /> },
];
