import {
  useGetMyServersQuery,
  useTransmitBannerQuery,
} from '@beep/server'
import { skipToken } from '@reduxjs/toolkit/query'
import { useParams } from 'react-router'
import ChannelsNavigation from '../../ui/channels-navigation'
import { ChannelsProvider } from './channels-navigation-context'

export function ChannelsNavigationFeature() {
  const { serverId } = useParams<{ serverId: string }>()
  const { server } = useGetMyServersQuery(undefined, {
    skip: serverId === undefined,
    selectFromResult(state) {
      if (state.data === undefined) return { server: undefined, ...state }
      return {
        server: state.data.find((server) => server.id === serverId),
        ...state,
      }
    },
  })


  const { currentData: banner } = useTransmitBannerQuery(
    server?.id ?? skipToken,
    {
      skip: server?.banner === undefined || server?.banner === '',
    }
  )

  return (
    <ChannelsProvider>
      <ChannelsNavigation
        key={'server_' + server?.id}
        banner={server?.banner !== '' ? banner : undefined}
      />
    </ChannelsProvider>
  )
}
