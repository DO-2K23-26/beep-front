import { Settings } from 'lucide-react'

import { ServerEntity } from '@beep/contracts'
import { useTransmitPictureQuery } from '@beep/server'
import { SettingsModal, SubSettings } from '@beep/settings'
import {
  Button,
  ButtonStyle,
  DialogCloseButton,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  Icon,
} from '@beep/ui'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { OverviewSettingsServer } from './overview-settings-server'

interface ServerDropDownMenuProps {
  server?: ServerEntity
}
export function ServerDropdownMenu({ server }: ServerDropDownMenuProps) {
  const { t } = useTranslation()

  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false)

  const subSetting: SubSettings = {
    subGroupSettingTitle: t('layout.server-dropdown-menu.server'),
    settings: [
      {
        title: t('layout.server-dropdown-menu.overview'),
        id: 'overview',
        settingComponent: (
          <OverviewSettingsServer server={server} />
        ),
      },
    ],
  }

  const handleSettingsClick = () => {
    setIsSettingsModalOpen(true)
  }

  const icon = useTransmitPictureQuery(server?.id ?? '').currentData ?? ''

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger>
          <Button style={ButtonStyle.SQUARE}>
            {server ? (
              icon ? (
                <img
                  src={icon}
                  alt="Server"
                  className=" aspect-square rounded-xl hover:rounded-2x3 transition-all object-cover"
                />
              ) : (
                <p className="max-w-[175px] truncate">{server.name[0]}</p>
              )
            ) : (
              <p>@ME</p>
            )}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56">
          <DropdownMenuSeparator />
          <DropdownMenuGroup>
            <DropdownMenuItem onClick={handleSettingsClick}>
              <Settings className="mr-2 h-4 w-4" />
              <span>{t('layout.server-dropdown-menu.server-settings')}</span>
              {/* quand on cliques, ca ouvre overview-settings-server.tsx */}
            </DropdownMenuItem>
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>
      {isSettingsModalOpen && (
        <DialogCloseButton content={<SettingsModal settings={[subSetting]} />}>
          <Icon name="lucide:settings" className="w-10 h-10" />
        </DialogCloseButton>
      )}
    </>
  )
}
