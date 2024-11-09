import { ReactNode } from 'react'
import {
  FullScreenDialog,
  FullScreenDialogContent,
  FullScreenDialogDescription,
  FullScreenDialogHeader,
  FullScreenDialogTitle,
  FullScreenDialogTrigger,
} from './full-screen-dialog'
import * as VisuallyHidden from '@radix-ui/react-visually-hidden'
interface DialogCloseButtonProps {
  children: ReactNode
  content: ReactNode
}

export function DialogCloseButton({
  content,
  children,
}: DialogCloseButtonProps) {
  return (
    <FullScreenDialog>

      <FullScreenDialogTrigger asChild>
        <button className="cursor-pointer w-full">{children}</button>
      </FullScreenDialogTrigger>
      <VisuallyHidden.Root>
        <FullScreenDialogHeader hidden>
          <FullScreenDialogTitle hidden>Settings</FullScreenDialogTitle>
          <FullScreenDialogDescription hidden>
            SettingsPage
          </FullScreenDialogDescription>
        </FullScreenDialogHeader>
      </VisuallyHidden.Root>
      <FullScreenDialogContent
        aria-describedby="Settings"
        title={'Setting Modal'}
        className="w-full h-full bg-white"
      >
        {content}
      </FullScreenDialogContent>
    </FullScreenDialog>
  )
}
