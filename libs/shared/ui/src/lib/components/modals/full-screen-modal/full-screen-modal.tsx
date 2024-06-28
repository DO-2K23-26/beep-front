import {
  FullScreenDialog,
  FullScreenDialogContent,
  FullScreenDialogTrigger,
  Icon,
} from '@beep/ui'
import { ReactNode } from 'react'

interface DialogCloseButtonProps {
  content: ReactNode
  icon: string
}

export function DialogCloseButton({ content, icon }: DialogCloseButtonProps) {
  return (
    <FullScreenDialog>
      <FullScreenDialogTrigger asChild>
        <button className="cursor-pointer">
          <Icon name={icon} className="!w-5 !h-5" />
        </button>
      </FullScreenDialogTrigger>
      <FullScreenDialogContent className="w-full h-full bg-white">
        {content}
      </FullScreenDialogContent>
    </FullScreenDialog>
  )
}
