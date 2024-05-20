import { ServerEntity } from '@beep/contracts'
import DisplayServerFeature from '../feature/display-server-feature'

export interface ListServersProps {
  servers: ServerEntity[] | undefined
}

export function ListServers({ servers }: ListServersProps) {
  return servers ? (
    <>
      {Array.isArray(servers) && servers.map((server) => (
        <DisplayServerFeature key={server.id} server={server} />
      ))}
    </>
  ) : null
}
