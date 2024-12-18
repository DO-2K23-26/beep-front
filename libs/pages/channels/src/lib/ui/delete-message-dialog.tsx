import {
  Button,
  ButtonStyle,
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@beep/ui'
import { PropsWithChildren } from 'react'
import { useTranslation } from 'react-i18next'

interface DeleteMessageDialogProps {
  onDeleteMessage: () => void
}

export function DeleteMessageDialog({
  children,
  onDeleteMessage,
}: PropsWithChildren<DeleteMessageDialogProps>) {
  const { t } = useTranslation()
  return (
    <Dialog>
      <DialogTrigger>{children}</DialogTrigger>
      <DialogContent className='bg-violet-50'>
        <DialogHeader>
          <DialogTitle> {t('channels.delete-message-modal.title')}</DialogTitle>
          <DialogDescription>
            {t('channels.delete-message-modal.description')}
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="flex gap-3 justify-between">
          <DialogClose>
            <Button className="btn--no-min-w" style={ButtonStyle.STROKED}>
              {t('channels.delete-message-modal.cancel')}
            </Button>
          </DialogClose>
          <DialogClose>
            <Button
              className="btn--no-min-w"
              style={ButtonStyle.ERROR}
              onClick={onDeleteMessage}
            >
              {t('channels.delete-message-modal.delete')}
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

