import {
  ButtonShadCn,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@beep/ui'
import { useTranslation } from 'react-i18next'

// eslint-disable-next-line @typescript-eslint/no-empty-interface
interface DeleteFriendDialogContentProps {
  onDelete: () => void
}

export function DeleteFriendDialogContent({
  onDelete,
}: DeleteFriendDialogContentProps) {
  const { t } = useTranslation()
  return (
    <DialogContent className="bg-violet-50">
      <DialogHeader>
        <DialogTitle>{t('friends.delete-friend-dialog.title')}</DialogTitle>
        <DialogDescription hidden>
          {t('friends.delete-friend-dialog.description')}
        </DialogDescription>
      </DialogHeader>
      <div>{t('friends.delete-friend-dialog.description')}</div>
      <DialogFooter className="gap-6 flex flex-row justify-end">
        <DialogClose asChild>
          <ButtonShadCn variant={'link'} className="text-slate-900 w-fit">
            {t('friends.delete-friend-dialog.cancel')}
          </ButtonShadCn>
        </DialogClose>
        <DialogClose asChild>
          <ButtonShadCn
            variant={'default'}
            className="bg-red-600 text-slate-900 w-fit"
            onClick={onDelete}
          >
            {t('friends.delete-friend-dialog.delete')}
          </ButtonShadCn>
        </DialogClose>
      </DialogFooter>
    </DialogContent>
  )
}
