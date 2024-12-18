import { useTranslation } from 'react-i18next'
import { LinkAuthenticatorApp } from '../../ui/security-settings/link-authenticator-app'
import { QRCodeSVG } from 'qrcode.react'
import { Button, InputText } from '@beep/ui'
import { Controller, useForm } from 'react-hook-form'
import { useComplete2FARegistrationMutation } from '@beep/user'

interface LinkAuthenticatorAppFeatureProps {
  totpURI: string
}

export function LinkAuthenticatorAppFeature({
  totpURI,
}: LinkAuthenticatorAppFeatureProps) {
  const { t } = useTranslation()
  const [complete2FA, { isLoading, data, isError }] =
    useComplete2FARegistrationMutation()

  const totpFormController = useForm({
    mode: 'onChange',
    defaultValues: {
      totp: '',
    },
  })

  if (isError) {
    totpFormController.setError('totp', {
      type: 'custom',
      message: t('layout.security-settings.tfa-n-activated.error'),
    })
  }

  const codeField = (
    <Controller
      name="totp"
      control={totpFormController.control}
      rules={{
        required: t('layout.security-settings.ask-password.error'),
      }}
      render={({ field, fieldState: { error } }) => (
        <InputText
          label="Token"
          type="text"
          name="text"
          className="w-full !rounded-lg min-h-[40px]"
          value={field.value}
          onChange={field.onChange}
          error={error?.message}
        />
      )}
    />
  )
  return (
    <LinkAuthenticatorApp
      codeField={codeField}
      totpURI={totpURI}
      button={
        <Button
          onClick={() => {
            const totp = totpFormController.getValues('totp')
            complete2FA({
              totp: totp,
            })
          }}
          loading={isLoading}
        >
          {t('auth.page-reset-password.submit')}
        </Button>
      }
    />
  )
}
