import { ServerEntity } from '@beep/contracts'
import { serverActions, useGetServerChannelsQuery } from '@beep/server'
import DisplayServer from '../ui/display-server'
import { useDispatch } from 'react-redux'
import { AppDispatch } from '@beep/store'
import { useNavigate } from 'react-router-dom'

interface DisplayServerFeatureProps {
  server: ServerEntity
}

export default function DisplayServerFeature({
  server,
}: DisplayServerFeatureProps) {
  const navigate = useNavigate()
  const dispatch = useDispatch<AppDispatch>()
  const { data: channels } = useGetServerChannelsQuery(server.id)
  const onServerChange = () => {
    dispatch(serverActions.setServer(server))
    if (channels && channels.length > 0) {
      // console.log('channels : ', channels)
      // console.log('/${server.id}/channels/${channels[0].id}', channels[0].id)
      navigate(`/servers/${server.id}/channels/${channels[0].id}`)
    } else {
      navigate(`/servers/@me`)
    }
  }
  return <DisplayServer server={server} onServerChange={onServerChange} />
}
