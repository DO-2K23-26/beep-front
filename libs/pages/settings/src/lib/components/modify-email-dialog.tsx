import { Button, DialogComponent, InputText } from '@beep/ui'
import { Controller, UseFormReturn } from 'react-hook-form'
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
      title={'Choose a new email'}
      triggerModalButton={
        <Button>{t('settings.components.modify-email-dialog.modify')}</Button>
      }
      content={
        <>
          <p>
            We need to verify your old email address,{' '}
            <strong>{currentUserEmail}</strong>, in order to change it.
          </p>
          <p>
            Have you lost access to your email? Contact your email provider to
            regain access.
          </p>
        </>
      }
      actionButtonTitle="Send verification code"
      action={action}
      isModalOpen={isModalOpen}
      setIsModalOpen={setIsModalOpen}
    />
  )
}
