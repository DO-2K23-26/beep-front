import { Button, DialogComponent, InputText } from '@beep/ui'
import { Controller, UseFormReturn } from 'react-hook-form'

interface ValidateOtpDialog {
  otpFormController: UseFormReturn<{ otp: string }, any, undefined>
  isModalOpen: boolean
  setIsModalOpen: (value: boolean) => void
  action: () => void
}

export function ValidateOtpDialog({
  action,
  isModalOpen,
  setIsModalOpen,
  otpFormController,
}: ValidateOtpDialog) {
  return (
    <DialogComponent
      title={'Enter Code'}
      triggerModalButton={
        !isModalOpen && ( // Hide the button when the modal is open
          <div>
            <Button>Modify</Button>
          </div>
        )
      }
      content={
        <>
          <p>
            Check your email: we've sent you a verification code. Enter it here
            to verify your identity.
          </p>
          <Controller
            name="otp"
            rules={{
              required: 'Otp code is required',
              pattern: {
                value: /^[A-ZÀ-Ý][a-zà-ÿ]*(?:[ '-][A-ZÀ-Ý][a-zà-ÿ]*)?$/,
                message:
                  'Last name should start with an uppercase letter, contain only letters, and allow one hyphen, space, or apostrophe between two parts of the name',
              },
            }}
            control={otpFormController.control}
            render={({ field, fieldState: { error } }) => (
              <InputText
                label="OTP Code"
                type="text"
                name="firstname"
                className="w-full !rounded-lg min-h-[40px]"
                value={field.value}
                onChange={field.onChange}
                error={error?.message}
              />
            )}
          />
          <p>Verification Code: Didn't receive a code or it expired? Resend.</p>
        </>
      }
      actionButtonTitle="Confirm"
      action={action}
      isModalOpen={isModalOpen}
      setIsModalOpen={setIsModalOpen}
    />
  )
}
