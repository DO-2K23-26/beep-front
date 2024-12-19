import { useGetServerChannelsQuery } from '@beep/server'
import { skipToken } from '@reduxjs/toolkit/query'
import { useEffect } from 'react'
import { useNavigate, useParams } from 'react-router'
import { EmptyServerPage } from '../ui/empty-server-page'

export function EmptyServerPageFeature() {
  const navigate = useNavigate()
  const { serverId } = useParams<{
    channelId: string
    serverId: string
  }>()
  const { data: channels } = useGetServerChannelsQuery(serverId ?? skipToken)
  // If the user try to go to the empty page
  // he will be redirected if there are channels in the server
  useEffect(() => {
    if (channels && channels.textChannels.length !== 0) {
      const firstChan = channels.textChannels[0]

      
      if (firstChan) {
        navigate(`/servers/${serverId}/channels/${firstChan.id}`)
      }
    }
  }, [channels, navigate, serverId])

  return <EmptyServerPage />
}
