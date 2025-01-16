import {
  ButtonIcon,
  FullScreenDialog,
  FullScreenDialogTrigger,
  Icon,
} from '@beep/ui'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@radix-ui/react-dropdown-menu'
import { RoleEntity } from 'libs/shared/contracts/src/lib/entities/role.entity'

export interface RoleServerProps {
  role: RoleEntity
}

export function RoleServer({ role }: RoleServerProps) {
  return (
    <div className="flex justify-between items-center">
      <p className="font-bold text-base">{role.name}</p>
      <FullScreenDialog>
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
            <FullScreenDialogTrigger>
              <DropdownMenuItem
                className="flex flex-row items-center hover:bg-black/10 gap-2 px-2 py-[6px] rounded-md cursor-pointer"
                onClick={() => alert(`Modifier ${role.name}`)}
              >
                <Icon name="lucide:settings" />
                <p className="font-semibold">Modifier</p>
              </DropdownMenuItem>
              <DropdownMenuItem
                className="flex flex-row items-center hover:bg-red-500/10 gap-2 px-2 py-[6px] rounded-md cursor-pointer"
                onClick={() => alert(`Supprimer ${role.name}`)}
              >
                <Icon name="lucide:trash-2" />
                <p className="font-semibold text-red-500">Supprimer</p>
              </DropdownMenuItem>
            </FullScreenDialogTrigger>
          </DropdownMenuContent>
        </DropdownMenu>
      </FullScreenDialog>
    </div>
  )
}
