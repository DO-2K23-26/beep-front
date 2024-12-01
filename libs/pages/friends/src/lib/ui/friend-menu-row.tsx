import {
  Dialog,
  DialogTrigger,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@beep/ui'
import { PropsWithChildren } from 'react'
import { useTranslation } from 'react-i18next'
import { DeleteFriendDialogFeature } from '../feature/delete-friend-dialog-feature'
import { UserDisplayedEntity } from '@beep/contracts'

// eslint-disable-next-line @typescript-eslint/no-empty-interface
interface FriendMenuRowProps {
  user: UserDisplayedEntity
}

export function FriendMenuRow({
  children,
  user
}: PropsWithChildren<FriendMenuRowProps>) {
  const { t } = useTranslation()
  return (
    <Dialog>
      {/* This is the shadcn advices to trigger a modal inside a dropdown see
          https://ui.shadcn.com/docs/components/dialog#notes */}
      <DropdownMenu>
        <DropdownMenuTrigger>{children}</DropdownMenuTrigger>
        <DropdownMenuContent className="w-48">
          <DialogTrigger className="flex flex-row w-full">
            <DropdownMenuItem className="w-full">
              <div className="text-red-600 font-semibold text-md sm:text-lg cursor-pointer w-full text-start">
                {t('friends.delete-friend-menu.delete')}
              </div>
            </DropdownMenuItem>
          </DialogTrigger>
        </DropdownMenuContent>
      </DropdownMenu>
      {/* This is the modal that will be triggered */}
      <DeleteFriendDialogFeature user={user} />
    </Dialog>
  )
}
