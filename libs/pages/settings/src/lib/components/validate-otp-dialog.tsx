import { Button, DialogComponent, InputText } from '@beep/ui'
import { Controller, UseFormReturn } from 'react-hook-form'

interface ValidateOtpDialog {
  otpFormController: UseFormReturn<{ otp: string }, any, undefined>
  isModalOpen: boolean
  setIsModalOpen: (value: boolean) => void
  action: () => void
  resendOtp: () => void // Nouvelle fonction
}

export function ValidateOtpDialog({
  action,
  isModalOpen,
  setIsModalOpen,
  otpFormController,
  resendOtp,
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
                value: /^\d{6}$/, // Expression régulière pour exactement 6 chiffres
                message: 'OTP code must be exactly 6 digits',
              },
            }}
            control={otpFormController.control}
            render={({ field, fieldState: { error } }) => (
              <InputText
                label="OTP Code"
                type="text"
                name="otp"
                className="w-full !rounded-lg min-h-[40px]"
                value={field.value}
                onChange={field.onChange}
                error={error?.message}
              />
            )}
          />
          <p> Didn't receive a code or it expired?{' '}
            <button
              onClick={resendOtp}
              className="text-purple-600 font-medium hover:underline !bg-transparent !p-0 !m-0 !min-w-0 !h-fit inline"
              style={{
                display: 'inline',
                padding: 0,
                border: 'none',
                background: 'none',
                cursor: 'pointer',
              }}
            >
              Resend
            </button>
          </p>
        </>
      }
      actionButtonTitle="Confirm"
      action={action}
      isModalOpen={isModalOpen}
      setIsModalOpen={setIsModalOpen}
    />
  )
}
