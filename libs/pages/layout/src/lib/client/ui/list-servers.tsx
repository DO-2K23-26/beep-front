import { ServerEntity } from '@beep/contracts'
import DisplayServerFeature from '../feature/display-server-feature'

export interface ListServersProps {
  servers: ServerEntity[]
}

export function ListServers({ servers }: ListServersProps) {
  return (
    <>
      {servers.map((server) => (
        <DisplayServerFeature key={server.id} server={server} />
      ))}
    </>
  )
}
