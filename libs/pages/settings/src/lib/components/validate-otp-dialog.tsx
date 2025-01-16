import { Button, DialogComponent, InputText } from '@beep/ui'
import { Controller, UseFormReturn } from 'react-hook-form'
import { useTranslation } from 'react-i18next'

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
  const { t } = useTranslation()
  return (
    <DialogComponent
      title={t('settings.components.validate-otp-dialog.title')}
      triggerModalButton={
        !isModalOpen && ( // Hide the button when the modal is open
          <div>
            <Button>
              {t('settings.components.validate-otp-dialog.modify')}
            </Button>
          </div>
        )
      }
      content={
        <>
          <p>{t('settings.components.validate-otp-dialog.content')}.</p>
          <Controller
            name="otp"
            rules={{
              required: t(
                'settings.components.validate-otp-dialog.otp_rules_required'
              ),
              pattern: {
                value: /^\d{6}$/, // Expression régulière pour exactement 6 chiffres
                message: t(
                  'settings.components.validate-otp-dialog.otp_rules_message'
                ),
              },
            }}
            control={otpFormController.control}
            render={({ field, fieldState: { error } }) => (
              <InputText
                label={t('settings.components.validate-otp-dialog.field_label')}
                type="text"
                name="otp"
                className="w-full !rounded-lg min-h-[40px]"
                value={field.value}
                onChange={field.onChange}
                error={error?.message}
              />
            )}
          />
          <p>
            {t('settings.components.validate-otp-dialog.resend_message')}{' '}
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
              {t('settings.components.validate-otp-dialog.resend_button')}
            </button>
          </p>
        </>
      }
      actionButtonTitle={t(
        'settings.components.validate-otp-dialog.action_button'
      )
}
      action={action}
      isModalOpen={isModalOpen}
      setIsModalOpen={setIsModalOpen}
    />
  )
}
