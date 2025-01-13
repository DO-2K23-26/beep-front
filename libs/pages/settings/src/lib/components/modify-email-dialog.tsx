import { Button, DialogComponent } from '@beep/ui'
import { UseFormReturn } from 'react-hook-form'
import { useTranslation } from 'react-i18next'

interface ModifyEmailDialogProps {
  emailFormController: UseFormReturn<{ email: string }, any, undefined>
  isModalOpen: boolean
  setIsModalOpen: (value: boolean) => void
  action: () => void // action now will call the handleEmailSubmit with currentUserEmail
  currentUserEmail: string
}

export function ModifyEmailDialog({
  action,
  isModalOpen,
  setIsModalOpen,
  currentUserEmail,
}: ModifyEmailDialogProps) {
  const { t } = useTranslation()

  return (
    <DialogComponent
      title={t('settings.components.modify-email-dialog.title')}
      triggerModalButton={
        <Button>{t('settings.components.modify-email-dialog.modify')}</Button>
      }
      content={
        <>
          <p>
            {t('settings.components.modify-email-dialog.content_1')},{' '}
            <strong>{currentUserEmail}</strong>,{' '}
            {t('settings.components.modify-email-dialog.content_2')}.
          </p>
          <p>{t('settings.components.modify-email-dialog.content_3')}.</p>
        </>
      }
      actionButtonTitle={t('settings.components.modify-email-dialog.action_content_button')}
      action={action}
      isModalOpen={isModalOpen}
      setIsModalOpen={setIsModalOpen}
    />
  )
}
