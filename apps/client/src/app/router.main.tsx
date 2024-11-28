import { ServersNavigationFeature } from '@beep/layout'
import { createBrowserRouter, Navigate } from 'react-router-dom'
import App from './app'
import { serverRoutes } from '@beep/pages/channels'
import { autenticationRouter } from '@beep/auth'

export const router = createBrowserRouter([
  {
    path: '/',
    Component: App,
    children: [
      {
        index: true,
        element: <Navigate to="/authentication" replace />,
      },
      {
        path: 'authentication',
        children: autenticationRouter,
      },
      {
        path: 'servers',
        Component: ServersNavigationFeature,
        children: serverRoutes,
      },
      {
        path: '*',
        element: <Navigate to="/authentication" replace />,
      },
    ],
  },
])
