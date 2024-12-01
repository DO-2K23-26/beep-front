import { ServerEntity } from '@beep/contracts'
import { getResponsiveState } from '@beep/responsive'
import { ButtonShadCn, Icon, UseModalProps } from '@beep/ui'
import { cn } from '@beep/utils'
import { useSelector } from 'react-redux'
import { Link, Outlet } from 'react-router-dom'
import AddServerFeature from '../feature/add-server-feature'
import { ListServers } from './list-servers'

interface ServersNavigationProps {
  servers: ServerEntity[] | undefined
  responsive: boolean
  onPrivateMessage?: () => void
  onLogout?: () => void
  openModal: React.Dispatch<React.SetStateAction<UseModalProps | undefined>>
  closeModal: () => void
}

export default function ServersNavigation({
  servers,
  responsive,
  onPrivateMessage,
  onLogout,
  openModal,
  closeModal,
}: ServersNavigationProps) {
  const { showRightPane } = useSelector(getResponsiveState)

  return (
    <div className="flex flex-row w-full h-dvh justify-end bg-violet-500">
      <div className="w-full h-full">
        <Outlet />
      </div>
      <div
        className={cn('flex', {
          'w-fit': showRightPane,
          'hidden md:flex': !showRightPane && responsive,
        })}
      >
        <div
          className={cn(
            'flex flex-col gap-4 md:gap-6 py-2 sm:py-4 px-2 md:px-4'
          )}
        >
          <div className="h-fit">
            <ButtonShadCn
              // onClick={onPrivateMessage}
              className="bg-violet-50 cursor-not-allowed"
              size={'responsiveSquare'}
              variant={'hoverRounded'}
            >
              <Icon name="lucide:mail" className="w-5 h-5" />
            </ButtonShadCn>
          </div>
          <div className="flex overflow-y-scroll scroll-smooth">
            <ListServers servers={servers} />
          </div>
          <div className="flex flex-col gap-4 md:gap-6">
            <ButtonShadCn
              className="bg-violet-50"
              size={'responsiveSquare'}
              variant={'hoverRounded'}
              onClick={() => {
                openModal({
                  content: <AddServerFeature closeModal={closeModal} />,
                })
              }}
            >
              <Icon name="lucide:plus" className="w-5 h-5" />
            </ButtonShadCn>
            <Link to="/servers/discover">
              <ButtonShadCn
                className="bg-violet-50"
                size={'responsiveSquare'}
                variant={'hoverRounded'}
              >
                <Icon name="lucide:compass" className="w-5 h-5" />
              </ButtonShadCn>
            </Link>
            <ButtonShadCn
              onClick={onLogout}
              className="bg-violet-50"
              size={'responsiveSquare'}
              variant={'hoverRounded'}
            >
              <Icon name="lucide:log-out" className="w-5 h-5" />
            </ButtonShadCn>
          </div>
        </div>
      </div>
    </div>
  )
}
