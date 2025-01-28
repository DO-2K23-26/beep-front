import { ServerEntity } from '@beep/contracts'
import { SettingBodyWidth, SettingsModal, SubSettings } from '@beep/settings'
import {
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  FullScreenDialog,
  FullScreenDialogContent,
  FullScreenDialogTrigger,
  Icon,
  UseModalProps,
} from '@beep/ui'
import { ReactNode } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router'
import DestroyServerFeature from '../feature/destroy-server-feature'
import { OverviewSettingsServer } from './overview-settings-server'

interface ServerDropdownProps {
  server: ServerEntity
  onClickId: (id: string) => void
  openModal: React.Dispatch<React.SetStateAction<UseModalProps | undefined>>
  closeModal: () => void
  isAdmin: boolean
  children: ReactNode
}

export function ServerDropdown({
  server,
  openModal,
  closeModal,
  isAdmin,
  children,
}: ServerDropdownProps) {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const navigateAfterDelete = () => navigate('/servers')
  // List of setting in the user setting modal
  const subSetting: SubSettings = {
    subGroupSettingTitle: t('layout.server-dropdown.server'),
    settings: [
      {
        title: t('layout.server-dropdown.overview'),
        settingComponent: server && (
          <OverviewSettingsServer server={server} isAdmin={isAdmin} />
        ),
        id: 'overview',
        settingBodySize: SettingBodyWidth.L,
      },
      // {
      //   title: t('layout.server-dropdown.roles'),
      //   settingComponent: server && (
      //     <RolesSettingsServerFeature server={server} />
      //   ),
      //   id: 'roles',
      //   settingBodySize: SettingBodyWidth.L,
      // },
    ],
  }
  return (
    <FullScreenDialog>
      <DropdownMenu>
        <DropdownMenuTrigger>{children}</DropdownMenuTrigger>
        <DropdownMenuContent className="rounded-lg bg-violet-50 mt-4 mx-5 py-4 px-3">
          <FullScreenDialogTrigger>
            <DropdownMenuItem className="flex flex-row h-full w-full hover:bg-black/10 gap-2 rounded-md cursor-pointer">
              <Icon name="lucide:settings" />
              <div className="flex h-full w-full font-semibold">
                {t('layout.server-dropdown.settings')}
              </div>
            </DropdownMenuItem>
          </FullScreenDialogTrigger>
          <DropdownMenuItem
            className="flex flex-row h-full w-full hover:bg-red-500/10 gap-2 rounded-md cursor-pointer"
            onClick={() => {
              openModal({
                content: (
                  <DestroyServerFeature
                    serverId={server.id}
                    closeModal={closeModal}
                    navigateAfterDelete={navigateAfterDelete}
                  />
                ),
              })
            }}
          >
            <Icon name="lucide:trash-2" className="fill-red-600" />
            <div className="flex h-full w-full font-semibold text-red-500">
              {t('layout.server-dropdown.destroy')}
            </div>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      <DialogHeader hidden>
        <DialogTitle hidden>Settings</DialogTitle>
        <DialogDescription hidden>SettingsPage</DialogDescription>
      </DialogHeader>

      <FullScreenDialogContent className="flex flex-row w-full h-full z-40">
        <SettingsModal settings={[subSetting]} />
      </FullScreenDialogContent>
    </FullScreenDialog>
  )
}
