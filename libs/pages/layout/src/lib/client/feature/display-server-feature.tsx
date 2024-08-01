import { ServerEntity } from '@beep/contracts'
import { serverActions, useGetServerChannelsQuery } from '@beep/server'
import { AppDispatch } from '@beep/store'
import { useDispatch } from 'react-redux'
import { useNavigate, useParams } from 'react-router-dom'
import DisplayServer from '../ui/display-server'

interface DisplayServerFeatureProps {
  server: ServerEntity
}

export default function DisplayServerFeature({
  server,
}: DisplayServerFeatureProps) {
  const navigate = useNavigate()
  const dispatch = useDispatch<AppDispatch>()
  const { data: channels } = useGetServerChannelsQuery(server.id)
  const params = useParams()
  const onServerChange = () => {
    // Check if we are not already on the server
    if (channels && params['*']?.split('/')[0] != server.id) {
      const firstChan = channels.textChannels[0]
      dispatch(serverActions.setServer(server))
      // If no channel are on the server display the default page
      if (firstChan) {
        navigate(`/servers/${server.id}/channels/${firstChan.id}`)
      } else {
        navigate(`/servers/${server.id}`)
      }
    }
  }
  return <DisplayServer server={server} onServerChange={onServerChange} />
}
