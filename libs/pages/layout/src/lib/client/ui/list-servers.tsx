import { ServerEntity } from '@beep/contracts'
import DisplayServerFeature from '../feature/display-server-feature'

export interface ListServersProps {
  servers: ServerEntity[] | undefined
}

export function ListServers({ servers }: ListServersProps) {
  return servers ? (
    <div className="h-fit flex flex-col gap-4 md:gap-6">
      {Array.isArray(servers) &&
        servers.map((server) => (
          <DisplayServerFeature key={server.id} server={server} />
        ))}
    </div>
  ) : null
}
