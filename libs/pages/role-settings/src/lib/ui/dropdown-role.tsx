import {
  ButtonIcon,
  Dialog,
  DialogTrigger,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  Icon
} from '@beep/ui'
import { useContext } from 'react'
import { useTranslation } from 'react-i18next'
import { RolesSettingsContext } from '../feature/roles-settings-provider'
import { DeleteRoleDialog } from './delete-role-dialog'

interface DropdownRoleProps {
  roleId: string
}

export function DropdownRole({ roleId }: DropdownRoleProps) {
  const { t } = useTranslation()
  const { goToRoleEdition, deleteRole } = useContext(RolesSettingsContext)
  return (
    <Dialog>
      <DropdownMenu>
        <DropdownMenuTrigger>
          <ButtonIcon
            icon={'lucide:ellipsis-vertical'}
            className="bg-violet-400 p-2"
            buttonProps={{ variant: 'hoverRounded' }}
            textHiddenResponsive
          />
        </DropdownMenuTrigger>
        <DropdownMenuContent className="rounded-lg bg-violet-50 mt-4 mx-5 py-4 px-3">
          <DropdownMenuItem
            className="flex flex-row items-center hover:bg-black/10 gap-2 px-2 py-[6px] rounded-md cursor-pointer"
            onClick={() => goToRoleEdition && goToRoleEdition(roleId)}
          >
            <Icon name="lucide:settings" />
            <p className="font-semibold">{t('layout.role-server.update')}</p>
          </DropdownMenuItem>

          <DialogTrigger>
            <DropdownMenuItem className="flex flex-row items-center hover:bg-red-500/10 gap-2 px-2 py-[6px] rounded-md cursor-pointer">
              <Icon name="lucide:trash-2" />
              <p className="font-semibold text-red-500">
                {t('layout.role-server.delete')}
              </p>
            </DropdownMenuItem>
          </DialogTrigger>
        </DropdownMenuContent>
      </DropdownMenu>

      <DeleteRoleDialog onDelete={() => deleteRole && deleteRole(roleId)} />
    </Dialog>
  )
}
