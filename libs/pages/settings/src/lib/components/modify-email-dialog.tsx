import { Button, DialogComponent, InputText } from '@beep/ui'
import { Controller, UseFormReturn } from 'react-hook-form'

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
  return (
    <DialogComponent
      title={'Verify the email address'}
      triggerModalButton={<Button>Modify</Button>}
      content={
        <>
          {/* <Controller
            name="email"
            rules={{
              required: 'Enter a new email adress',
              pattern: {
                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                message: 'Invalid email address',
              },
            }}
            control={emailFormController.control}
            render={({ field, fieldState: { error } }) => (
              <InputText
                label="Email"
                type="email"
                name="email"
                className="w-full !rounded-lg min-h-[40px]"
                value={field.value}
                onChange={field.onChange}
                error={error?.message}
              />
            )}
          /> */}
          <p>We need to verify your old email address, <strong>{currentUserEmail}</strong>, in order to change it.</p>
          <p>Have you lost access to your email? Contact your email provider to regain access.</p>
        </>
      }
      actionButtonTitle="Send verification code"
      action={action}
      isModalOpen={isModalOpen}
      setIsModalOpen={setIsModalOpen}
    />
  )
}
