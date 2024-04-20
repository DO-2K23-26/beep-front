import { ServerEntity } from '@beep/contracts'
import { Button, ButtonStyle, Icon } from '@beep/ui'
import { ListServers } from './list-servers'

interface ServersNavigationProps {
  servers: ServerEntity[]
  onPrivateMessage?: () => void
  onLogout?: () => void
}

export default function ServersNavigation({
  servers,
  onPrivateMessage,
  onLogout,
}: ServersNavigationProps) {
  return (
    <div className="bg-violet-500 flex flex-col w-min p-6 ">
      <div className="pb-12">
        <Button onClick={onPrivateMessage} style={ButtonStyle.SQUARE}>
          <Icon name="lucide:mail" className="w-5 h-5" />
        </Button>
      </div>
      <div className="flex flex-col gap-6 flex-grow overflow-y-scroll no-scrollbar scroll-smooth">
        <ListServers servers={servers} />
        <Button
          onClick={() => {
            console.log('+')
          }}
          style={ButtonStyle.SQUARE}
        >
          <Icon name="lucide:plus" className="w-5 h-5" />
        </Button>
      </div>
      <div className="pt-12">
        <Button onClick={onLogout} style={ButtonStyle.SQUARE}>
          <Icon name="lucide:log-out" className="w-5 h-5" />
        </Button>
      </div>
    </div>
  )
}
