import { Button, DialogComponent, InputText } from '@beep/ui'
import { Controller, UseFormReturn } from 'react-hook-form'
import { useTranslation } from 'react-i18next'

interface ValidateEmailDialogProps {
  updateEmailFormController: UseFormReturn<{ password: string, email: string }, any, undefined>
  isModalOpen: boolean
  setIsModalOpen: (value: boolean) => void
  action: () => void
}
export function ValidateEmailDialog({
  action,
  isModalOpen,
  setIsModalOpen,
  updateEmailFormController,
}: ValidateEmailDialogProps) {
  const { t } = useTranslation()

  return (
    <DialogComponent
      title={t('settings.modify-email-dialog.title')}
      triggerModalButton={
        !isModalOpen && ( // Hide the button when the modal is open
          <div>
            <Button>Modify</Button>
          </div>
        )
      }
      content={
        <>
          <Controller
            name="password"
            rules={{ required: 'Enter your current password' }}
            control={updateEmailFormController.control}
            render={({ field, fieldState: { error } }) => (
              <InputText
                label="Current Password"
                type="password"
                name="currentPassword"
                className="w-full !rounded-lg min-h-[40px]"
                value={field.value}
                onChange={field.onChange}
                error={error?.message}
              />
            )}
          />
          <Controller
            name="email"
            rules={{
              required: 'Email is required',
              pattern: {
                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                message: 'Invalid email address',
              },
            }}
            control={updateEmailFormController.control}
            render={({ field, fieldState: { error } }) => (
              <InputText
                label="Email"
                type="text"
                name="email"
                className="w-full !rounded-lg min-h-[40px]"
                value={field.value}
                onChange={field.onChange}
                error={error?.message}
              />
            )}
          />
        </>
      }
      actionButtonTitle="Confirm"
      action={action}
      isModalOpen={isModalOpen}
      setIsModalOpen={setIsModalOpen}
    />
  )
}
