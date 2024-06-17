import {
  FullScreenDialog,
  FullScreenDialogContent,
  FullScreenDialogTrigger
} from '@beep/ui'
import { ReactNode } from 'react'

interface DialogCloseButtonProps {
  triggerButton: ReactNode
  content: ReactNode
}

export function DialogCloseButton({ content, triggerButton }: DialogCloseButtonProps) {
  return (
    <FullScreenDialog>
      <FullScreenDialogTrigger asChild>
        <button className="cursor-pointer">
          {triggerButton}
        </button>
      </FullScreenDialogTrigger>
      <FullScreenDialogContent className="w-full h-full bg-white">
        {content}
      </FullScreenDialogContent>
    </FullScreenDialog>
  )
}
