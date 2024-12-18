import {
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@beep/ui'
import { ReactNode } from 'react'
import { useTranslation } from 'react-i18next'

export function AskPasswordStep({
  children,
  button,
}: {
  children: ReactNode
  button: ReactNode
}) {
  const { t } = useTranslation()
  return (
    <DialogContent title="Dialog" className="sm:max-w-[425px] bg-violet-50">
      <DialogHeader>
        <DialogTitle>
          {t('layout.security-settings.ask-password.title')}
        </DialogTitle>
        <DialogDescription>
          {t('layout.security-settings.ask-password.subtitle')}
        </DialogDescription>
      </DialogHeader>
      {children}
      <DialogFooter>{button}</DialogFooter>
    </DialogContent>
  )
}
