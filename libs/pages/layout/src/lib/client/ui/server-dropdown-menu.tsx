import {
  Cloud,
  CreditCard,
  Github,
  Keyboard,
  Leaf,
  LifeBuoy,
  LogOut,
  Mail,
  MessageSquare,
  Plus,
  PlusCircle,
  Settings,
  User,
  UserPlus,
  Users,
} from 'lucide-react'

import { Button, ButtonStyle, DialogCloseButton } from '@beep/ui'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from '@beep/ui'
import { ServerEntity } from '@beep/contracts'
import { useState } from 'react'
import { SettingsModal } from '@beep/settings'
import { OverviewSettingsServer } from './overview-settings-server'
import { SubSettings } from 'libs/pages/settings/src/lib/models/setting-navigation-models'

interface ServerDropDownMenuProps {
  server?: ServerEntity
}
export function ServerDropdownMenu({ server }: ServerDropDownMenuProps) {
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false)


  const subSetting: SubSettings = {
    subGroupSettingTitle: 'Server',
    settings: [
      {
        title: 'Overview',
        settingComponent: <OverviewSettingsServer server={server!} />,
      },
      // { title: 'voice', settingComponent: <Input /> },
      // { title: 'text', settingComponent: <Input /> },
    ],
  }

  const handleSettingsClick = () => {
    setIsSettingsModalOpen(true)
  }

  const closeSettingsModal = () => {
    setIsSettingsModalOpen(false)
  }

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger>
          <Button
            style={ButtonStyle.SQUARE}
            onClick={() => {
              console.log('click')
            }}
          >
            {server ? (
              server.picture ? (
                <img
                  src={server?.picture}
                  alt="Server"
                  className="rounded-xl hover:rounded-2xl transition-all"
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
            {/* <DropdownMenuItem>
          <CreditCard className="mr-2 h-4 w-4" />
          <span>Invite users</span>
          </DropdownMenuItem> */}
            {/* <DropdownMenuItem>
            <Plus className="mr-2 h-4 w-4" />
            <span>Create a room</span>
          </DropdownMenuItem> */}
            <DropdownMenuItem onClick={handleSettingsClick}>
              <Settings className="mr-2 h-4 w-4" />
              <span>Settings</span>
              {/* quand on cliques, ca ouvre overview-settings-server.tsx */}
            </DropdownMenuItem>
            {/* <DropdownMenuItem>
            <LogOut className="mr-2 h-4 w-4" />
            <span>Leave server</span>
          </DropdownMenuItem> */}
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>

      {isSettingsModalOpen && (
        <DialogCloseButton
          icon={'lucide:settings'}
          content={<SettingsModal settings={[subSetting]} />}
        />
      )}
    </>
  )
}
