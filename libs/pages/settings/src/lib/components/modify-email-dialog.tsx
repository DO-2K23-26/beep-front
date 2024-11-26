import { Button, DialogComponent, InputText } from '@beep/ui'
import { Controller, UseFormReturn } from 'react-hook-form'
import { useTranslation } from 'react-i18next'

interface ModifyEmailDialogProps {
  emailFormController: UseFormReturn<{ email: string }, any, undefined>
  isModalOpen: boolean
  setIsModalOpen: (value: boolean) => void
  action: () => void
  currentUserEmail: string
}
export function ModifyEmailDialog({
  action,
  isModalOpen,
  setIsModalOpen,
  emailFormController,
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
          {/* <Controller
            name="email"
            rules={{
              required: t(
                'settings.components.modify-email-dialog.required_email'
              ),
              pattern: {
                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                message: t(
                  'settings.components.modify-email-dialog.invalid_email'
                ),
              },
            }}
            control={emailFormController.control}
            render={({ field, fieldState: { error } }) => (
              <InputText
                label={t('settings.components.modify-email-dialog.email')}
                type="email"
                name="email"
                className="w-full !rounded-lg min-h-[40px]"
                value={field.value}
                onChange={field.onChange}
                error={error?.message}
              />
            )}
          />
          <p>{t('settings.components.modify-email-dialog.email_sented')}</p>
        </>
      }
      actionButtonTitle="Send verification code"
      action={action}
      isModalOpen={isModalOpen}
      setIsModalOpen={setIsModalOpen}
    />
  )
}
