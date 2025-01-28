import { Dialog, DialogTrigger } from '@beep/ui'
import { PropsWithChildren } from 'react'
import { DeleteRoleDialogContent } from './delete-role-dialog-content'

interface DeleteRoleDialogProps {
  onDelete?: () => void
}

export function DeleteRoleDialog({
  children,
  onDelete,
}: PropsWithChildren<DeleteRoleDialogProps>) {
  return (
    <Dialog>
      <DialogTrigger>{children}</DialogTrigger>
      <DeleteRoleDialogContent onDelete={onDelete} />
    </Dialog>
  )
}
