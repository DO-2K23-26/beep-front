import { useTranslation } from 'react-i18next'
import { AskPasswordStep } from '../../ui/security-settings/ask-password'
import { Controller, useForm } from 'react-hook-form'
import { Button, InputText } from '@beep/ui'
import { useCallback } from 'react'
import { useAskTOTPURIMutation } from '@beep/user'

interface AskPasswordStepFeatureProps {
  setTotpURI: (data: string) => void
}

export function AskPasswordStepFeature({
  setTotpURI,
}: AskPasswordStepFeatureProps) {
  const { t } = useTranslation()
  const [askTOPTQRCode, { isLoading, data, isError }] = useAskTOTPURIMutation()
  if (data && !isError) {
    setTotpURI(data.uri)
  }

  const passwordFormController = useForm({
    mode: 'onChange',
    defaultValues: {
      password: '',
    },
  })

  if (isError) {
    passwordFormController.setError('password', {
      type: 'custom',
      message: t('auth.page-signin.password_error'),
    })
  }

  return (
    <AskPasswordStep
      button={
        <Button
          loading={isLoading}
          onClick={() => {
            askTOPTQRCode({
              password: passwordFormController.getValues('password'),
            })
          }}
        >
          {t('auth.page-reset-password.submit')}
        </Button>
      }
    >
      <Controller
        name="password"
        rules={{
          required: t('layout.security-settings.ask-password.error'),
        }}
        control={passwordFormController.control}
        render={({ field, fieldState: { error } }) => (
          <InputText
            label={t('auth.page-signin.password')}
            type="password"
            name="password"
            className="w-full !rounded-lg min-h-[40px]"
            value={field.value}
            onChange={field.onChange}
            error={error?.message}
          />
        )}
      />
    </AskPasswordStep>
  )
}
