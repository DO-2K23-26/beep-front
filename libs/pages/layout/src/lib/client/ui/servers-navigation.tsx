import { ServerEntity } from '@beep/contracts'
import { Button, ButtonStyle, Icon, UseModalProps } from '@beep/ui'
import { Link } from 'react-router-dom'
import AddServerFeature from '../feature/add-server-feature'
import { ListServers } from './list-servers'

interface ServersNavigationProps {
  servers: ServerEntity[] | undefined
  onPrivateMessage?: () => void
  onLogout?: () => void
  openModal: React.Dispatch<React.SetStateAction<UseModalProps | undefined>>
  closeModal: () => void
}

export default function ServersNavigation({
  servers,
  onPrivateMessage,
  onLogout,
  openModal,
  closeModal,
}: ServersNavigationProps) {
  return (
    <div className="bg-violet-500 flex flex-col w-min p-6 ">
      <div className="pb-12">
        <Button
          onClick={onPrivateMessage}
          style={ButtonStyle.SQUARE}
          className="!bg-violet-50"
        >
          <Icon name="lucide:mail" className="w-5 h-5" />
        </Button>
      </div>
      <div className="flex flex-col gap-6 flex-grow overflow-y-scroll no-scrollbar scroll-smooth">
        <ListServers servers={servers} />
        <Button
          style={ButtonStyle.SQUARE}
          className="!bg-violet-50"
          onClick={() => {
            openModal({
              content: <AddServerFeature closeModal={closeModal} />,
            })
          }}
        >
          <Icon name="lucide:plus" className="w-5 h-5" />
        </Button>
        <Link to="/discover">
          <Button style={ButtonStyle.SQUARE} className="!bg-violet-50">
            <Icon name="lucide:compass" className="w-5 h-5" />
          </Button>
        </Link>
      </div>
      <div className="pt-12">
        <Button
          onClick={onLogout}
          style={ButtonStyle.SQUARE}
          className="!bg-violet-50"
        >
          <Icon name="lucide:log-out" className="w-5 h-5" />
        </Button>
      </div>
    </div>
  )
}

