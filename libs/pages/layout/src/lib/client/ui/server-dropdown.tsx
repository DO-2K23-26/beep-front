import { ServerEntity } from '@beep/contracts'
import { SettingsModal, SubSettings } from '@beep/settings'
import {
  Badge,
  BadgeType,
  DialogCloseButton,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
  Tooltip,
  TooltipContent,
  TooltipTrigger,
  UseModalProps,
} from '@beep/ui'
import { ReactNode } from 'react'
import DestroyServerFeature from '../feature/destroy-server-feature'
import { DropdownMenuItemCustom } from './dropdown-menu-item-custom'

interface ServerDropdownProps {
  server?: ServerEntity
  icon?: string
  onClickId: (id: string) => void
  openModal: React.Dispatch<React.SetStateAction<UseModalProps | undefined>>
  closeModal: () => void
  settings: SubSettings[]
  isAdmin: boolean
  triggerDropdownButton: ReactNode
}

export function ServerDropdown({
  server,
  icon,
  onClickId,
  openModal,
  closeModal,
  triggerDropdownButton,
  settings,
  isAdmin,
}: ServerDropdownProps) {
  return (
    <div className="relative z-0 flex flex-row gap-6 p-5 bg-white bg-opacity-10 rounded-xl">
      {/* <div className="flex flex-row gap-6"> */}
      <DropdownMenu>
        <DropdownMenuTrigger>{triggerDropdownButton}</DropdownMenuTrigger>
        <DropdownMenuContent className="rounded-lg bg-violet-50 mt-4 mx-5 py-4 px-3">
          {/* <DropdownMenuItemCustom
        label="Invite users"
        iconName="lucide:credit-card"
      /> //need dorian PR*/}
          {/* {isAdmin && (
        <DropdownMenuItemCustom
          label="Create channel"
          iconName="lucide:plus"
          onClick={() =>
            openModal({
              content: (
                <FormProvider {...methodsAddChannel}>
                  <CreateChannelModal
                    closeModal={closeModal}
                    onCreateChannel={onCreateChannel}
                    methodsAddChannel={methodsAddChannel}
                  />
                </FormProvider>
              ),
            })
          }
        />
    )} */}
          {server && (
            <DialogCloseButton
              triggerButton={
                <DropdownMenuItemCustom
                  label="Settings"
                  iconName="lucide:settings"
                />
              }
              content={<SettingsModal settings={settings} />}
            />
          )}

          {/* <DropdownMenuItemCustom
        label="Leave server"
        iconName="charm:sign-out"
        warning
      /> */}
          {isAdmin && (
            <div>
              <hr className="bg-slate-400 h-[1px] my-2 text-slate-400" />

              <DropdownMenuItemCustom
                label="Destroy server"
                iconName="lucide:trash-2"
                warning
                onClick={() => {
                  openModal({
                    content: <DestroyServerFeature closeModal={closeModal} />,
                  })
                }}
              />
            </div>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
      <div className="flex flex-col items-start justify-between">
        <h5 className="font-semibold max-w-[175px] truncate">{server?.name}</h5>
        <Tooltip>
          <TooltipTrigger>
            <Badge
              type={BadgeType.DEFAULT}
              title={server?.id ?? ''}
              className="bg-violet-50 hover:bg-violet-100 !text-violet-900 max-w-[175px] truncate cursor-pointer"
              onClick={() => onClickId(server?.id ?? '')}
            />
          </TooltipTrigger>
          <TooltipContent>
            <p>{server?.id ?? ''}</p>
          </TooltipContent>
        </Tooltip>
      </div>
    </div>
  )
}
