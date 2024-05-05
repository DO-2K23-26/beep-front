import { ServerEntity } from '@beep/contracts'
import { serverActions } from '@beep/server'
import DisplayServer from '../ui/display-server'
import { useDispatch } from 'react-redux'
import { AppDispatch } from '@beep/store'

interface DisplayServerFeatureProps {
  server: ServerEntity
}


export default function DisplayServerFeature({
  server,
}: DisplayServerFeatureProps) {
  const dispatch = useDispatch<AppDispatch>()
  const onServerChange = () => {
    dispatch(serverActions.setServer(server))
  }
  return <DisplayServer server={server} onServerChange={onServerChange} />
}
