import { ServerEntity } from '@beep/contracts'
import DisplayServer from '../ui/display-server'

interface DisplayServerFeatureProps {
  server: ServerEntity
}

const onServerChange = () => {
  console.log('Server change')
}

export default function DisplayServerFeature({
  server,
}: DisplayServerFeatureProps) {
  return <DisplayServer server={server} onServerChange={onServerChange} />
}
