import { ReactNode } from 'react'
import {
  FullScreenDialog,
  FullScreenDialogContent,
  FullScreenDialogTrigger,
} from './full-screen-dialog'

interface DialogCloseButtonProps {
  triggerButton: ReactNode
  content: ReactNode
}

export function DialogCloseButton({
  content,
  triggerButton,
}: DialogCloseButtonProps) {
  return (
    <FullScreenDialog>
      <FullScreenDialogTrigger asChild>
        <button className="cursor-pointer w-full">{triggerButton}</button>
      </FullScreenDialogTrigger>
      <FullScreenDialogContent className="w-full h-full bg-white">
        {content}
      </FullScreenDialogContent>
    </FullScreenDialog>
  )
}
