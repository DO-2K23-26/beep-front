import { KeyboardEventHandler } from 'react'
import { useFormContext } from 'react-hook-form'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { FormField } from './form-field'
import { AuthHeader } from './auth-header'
import AuthButton from './auth-button'
import AuthError from './auth-error'

export interface PageForgotPasswordProps {
  onSubmit: () => void
  loading?: boolean
  error?: string
}

export function PageForgotPassword({
  onSubmit,
  loading,
  error,
}: PageForgotPasswordProps) {
  const { t } = useTranslation()

  const { control } = useFormContext()
  const onKeyDown: KeyboardEventHandler<HTMLInputElement> = (e) =>
    e.key === 'Enter' ? onSubmit() : {}

  return (
    <div className="flex flex-col gap-12 z-10 max-w-3xl">
      <AuthHeader
        title={t('auth.page-forgot-password.forgot_password')}
        description={t('auth.page-forgot-password.description')}
      />
      <div className="flex flex-col gap-4 max-w-3xl">
        <FormField
          control={control}
          name="email"
          type="email"
          label={t('auth.page-forgot-password.email')}
          placeholder={t('auth.page-forgot-password.email')}
          onKeyDown={onKeyDown}
          rules={{
            required: t('auth.page-forgot-password.required_email'),
            pattern: {
              value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
              message: t('auth.page-forgot-password.invalid_email'),
            },
          }}
        />
        {error && <AuthError error={error} />}
      </div>
      <div className="flex flex-col sm:flex-row justify-between item sm:items-center gap-6 sm:gap-12">
        <div className="flex flex-row gap-1 font-bold text-sm">
          <p className="text-text-grayV2">
            {t('auth.page-forgot-password.go_back_signin')}
          </p>
          <Link
            className="text-primaryV2/90 hover:text-primaryV2"
            to="/authentication/signin"
          >
            {t('auth.page-forgot-password.signin')}
          </Link>
        </div>
        <AuthButton
          onSubmit={onSubmit}
          text={t('auth.page-forgot-password.send')}
        />
      </div>
    </div>
  )
}
