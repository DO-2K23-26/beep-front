import { useGetServerChannelsQuery } from '@beep/server'
import { skipToken } from '@reduxjs/toolkit/query'
import { useEffect } from 'react'
import { useNavigate, useParams } from 'react-router'
import { EmptyServerPage } from '../ui/empty-server-page'
import { useDispatch } from 'react-redux'
import { AppDispatch } from '@beep/store'
import { responsiveActions } from '@beep/responsive'

export function EmptyServerPageFeature() {
  const dispatch = useDispatch<AppDispatch>()
  const navigate = useNavigate()
  const params = useParams()
  const { data: channels } = useGetServerChannelsQuery(
    params['*']?.split('/')[0] ?? skipToken
  )
  // If the user try to go to the empty page
  // he will be redirected if there are channels in the server
  useEffect(() => {
    if (channels && channels.textChannels.length !== 0) {
      const firstChan = channels.textChannels[0]
      if (firstChan) {
        navigate(
          `/servers/${params['*']?.split('/')[0]}/channels/${firstChan.id}`
        )
      }
    }
  }, [channels, params, navigate])

  const hideRightDiv = () => {
    dispatch(responsiveActions.manageRightPane())
  }
  const hideLeftDiv = () => {
    dispatch(responsiveActions.manageLeftPane())
  }

  return (
    <EmptyServerPage hideRightDiv={hideRightDiv} hideLeftDiv={hideLeftDiv} />
  )
}
