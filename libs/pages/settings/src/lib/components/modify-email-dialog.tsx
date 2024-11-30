import { Button, DialogComponent } from '@beep/ui'
import { UseFormReturn } from 'react-hook-form'

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
  return (
    <DialogComponent
      title={'Verify the email address'}
      triggerModalButton={<Button>Modify</Button>}
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
