import { ReactNode } from 'react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from './dialog'
import { Button } from '../../buttons/button'

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
      <DialogContent title="Dialog" className="sm:max-w-[425px] bg-white">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription hidden>Description</DialogDescription>
        </DialogHeader>
        {content}
        <DialogFooter>
          <Button onClick={action}>{actionButtonTitle}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
