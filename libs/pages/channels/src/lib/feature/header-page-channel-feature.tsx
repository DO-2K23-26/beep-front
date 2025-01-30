import { responsiveActions } from '@beep/responsive'
import { useGetChannelQuery } from '@beep/server'
import { useDispatch } from 'react-redux'
import { useParams } from 'react-router'
import { HeaderPageChannel } from '../ui/header-page-channel'
import { Permissions } from '@beep/contracts'
import { ServerContext } from './page-server-feature'
import { useContext } from 'react'
export function HeaderPageFeature() {
  const { channelId, serverId } = useParams<{
    serverId: string
    channelId: string
  }>()

  const dispatch = useDispatch()
  const { myMember } = useContext(ServerContext)
  const { data: channel, isLoading: isLoadingChannel } = useGetChannelQuery(
    { channelId: channelId ?? '', serverId: serverId ?? '' },
    { skip: channelId === undefined || serverId === undefined }
  )
  const toggleLeftPane = () => {
    dispatch(responsiveActions.toggleLeftPane())
  }
  const toggleRightPane = () => {
    dispatch(responsiveActions.toggleRightPane())
  }

  const canViewChannels = myMember?.hasOnePermissions([
    Permissions.VIEW_CHANNELS,
  ])

  return (
    <HeaderPageChannel
      channel={channel}
      isLoadingChannel={isLoadingChannel}
      toggleLeftPane={toggleLeftPane}
      toggleRightPane={toggleRightPane}
      displayChannelInfo={channelId !== undefined}
      canViewChannels={canViewChannels}
    />
  )
}
