import { Button } from '@beep/ui'
import { ReactNode } from 'react'
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from './dialog'

interface DialogComponentProps {
  title: string
  triggerModalButton: ReactNode
  content: ReactNode
  action?: () => void
  actionButtonTitle?: string
  isModalOpen: boolean
  setIsModalOpen: (value: boolean) => void
}

export function DialogComponent({
  triggerModalButton,
  title,
  content,
  action,
  actionButtonTitle,
  isModalOpen,
  setIsModalOpen,
}: DialogComponentProps) {
  return (
    <Dialog open={isModalOpen} onOpenChange={setIsModalOpen} modal={true}>
      <DialogTrigger asChild>{triggerModalButton}</DialogTrigger>
      <DialogContent className="sm:max-w-[425px] bg-white">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        {content}
        <DialogFooter>
          <Button onClick={action}>{actionButtonTitle}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
