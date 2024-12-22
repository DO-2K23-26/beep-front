import { Controller, useFormContext } from 'react-hook-form'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { Button, Input, Label } from '@beep/shadcn'
import { ArrowRight, X } from 'lucide-react'
import { FormField } from './form-field'
import { AuthHeader } from './auth-header'

export interface PageResetPasswordProps {
  loading?: boolean
  error?: string
  onSubmit: () => void
}

export function PageResetPassword({
  loading,
  error,
  onSubmit,
}: PageResetPasswordProps) {
  const { t } = useTranslation()

  const { control, watch } = useFormContext()

  return (
    <div className="flex flex-col gap-12 z-10 max-w-3xl">
      <AuthHeader
        title={t('auth.page-reset-password.reset')}
        description={t('auth.page-reset-password.description')}
      />
      <div className="flex flex-col gap-4 max-w-3xl">
        <FormField
          control={control}
          name="password"
          type="password"
          label={t('auth.page-reset-password.password')}
          placeholder={t('auth.page-reset-password.password')}
          rules={{
            required: t('auth.page-reset-password.required_password'),
            pattern: {
              value:
                /^(?=.*[A-Z])(?=.*[0-9])(?=.*[!?@#$%^&*[|/\]{}()])(?=.{8,})/,
              message: t('auth.page-reset-password.invalid_password'),
            },
          }}
        />
        <FormField
          control={control}
          name="confirm-password"
          type="password"
          label={t('auth.page-reset-password.confirm')}
          placeholder={t('auth.page-reset-password.confirm')}
          rules={{
            required: t('auth.page-reset-password.required_confirm_password'),
            validate: (val: string) => {
              if (val !== watch('password')) {
                return t('auth.page-reset-password.password_mismatch')
              }
            },
          }}
        />
        {error && (
          <div className="flex flex-row gap-1 px-4">
            <X color="#FC3B8C" className="w-4 h-4" />
            <p className="font-medium text-xs text-primaryV2">{error}</p>
          </div>
        )}
      </div>
      <div className="flex flex-col sm:flex-row justify-between item sm:items-center gap-6 sm:gap-12">
        <div className="flex flex-row gap-1 font-bold text-sm">
          <p className="text-text-grayV2">
            {t('auth.page-reset-password.go_back_signin')}
          </p>
          <Link
            className="text-primaryV2/90 hover:text-primaryV2"
            to="/authentication/signin"
          >
            {t('auth.page-reset-password.signin')}
          </Link>
        </div>
        <Button variant={'signin'} size={'signin'} onClick={onSubmit}>
          <p className="font-bold text-whiteV2">
            {t('auth.page-reset-password.submit')}
          </p>
          <ArrowRight
            className="w-6 h-6 text-whiteV2 font-bold"
            color="#FF82B6"
          />
        </Button>
      </div>
    </div>
  )
}
