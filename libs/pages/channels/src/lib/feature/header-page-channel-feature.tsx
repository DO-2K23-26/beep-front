import { responsiveActions } from '@beep/responsive'
import { useGetChannelQuery, useGetMembersQuery } from '@beep/server'
import { useDispatch } from 'react-redux'
import { useParams } from 'react-router'
import { HeaderPageChannel } from '../ui/header-page-channel'
import { skipToken } from '@reduxjs/toolkit/query'

export function HeaderPageFeature() {
  const { channelId, serverId } = useParams<{
    serverId: string
    channelId: string
  }>()

  const dispatch = useDispatch()

  const { data: channel, isLoading: isLoadingChannel } = useGetChannelQuery(
    { channelId: channelId ?? '', serverId: serverId ?? '' },
    { skip: channelId === undefined || serverId === undefined }
  )
  const { data: usersServer } = useGetMembersQuery(serverId ?? skipToken)
  const toggleLeftPane = () => {
    dispatch(responsiveActions.toggleLeftPane())
  }
  const toggleRightPane = () => {
    dispatch(responsiveActions.toggleRightPane())
  }

  return (
    <HeaderPageChannel
      channel={channel}
      isLoadingChannel={isLoadingChannel}
      toggleLeftPane={toggleLeftPane}
      toggleRightPane={toggleRightPane}
      displayChannelInfo={channelId !== undefined}
      usersServer={usersServer ?? []}
    />
  )
}
