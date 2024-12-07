import { Button, InputText } from '@beep/ui'
import { KeyboardEventHandler } from 'react'
import { Controller, useFormContext } from 'react-hook-form'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'

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
    <div className="flex flex-col gap-6 justify-center items-start p-4">
      <h1 className="font-extrabold text-5xl">
        {t('auth.page-forgot-password.forgot_password')}
      </h1>
      <h5>{t('auth.page-forgot-password.insert_email')}</h5>
      <Controller
        name="email"
        rules={{
          required: t('auth.page-forgot-password.required_email'),
          pattern: {
            value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
            message: t('auth.page-forgot-password.invalid_email'),
          },
        }}
        control={control}
        render={({ field, fieldState: { error } }) => (
          <InputText
            label={t('auth.page-forgot-password.email')}
            type="email"
            name="email"
            className="w-full !rounded-lg min-h-[40px]"
            value={field.value}
            onChange={field.onChange}
            error={error?.message}
            onKeyDown={onKeyDown}
          />
        )}
      />
      <div className="flex flex-col w-full">
        <Button
          onClick={onSubmit}
          loading={loading}
          className="!bg-slate-800 hover:!bg-slate-900 w-full !rounded-lg min-h-[40px]"
        >
          <p className="text-violet-50">
            {t('auth.page-forgot-password.send')}
          </p>
        </Button>
        {error && (
          <p className="mt-1 px-4 font-medium text-xs text-red-500">{error}</p>
        )}
      </div>
      <div className="flex flex-row gap-1">
        <p className="font-normal">
          {t('auth.page-forgot-password.go_back_signin')}
        </p>
        <Link
          className="text-purple-600 font-medium hover:!bg-transparent !p-0 !min-w-0 !h-fit"
          to="/authentication/signin"
        >
          <p className="text-purple-600 font-normal">
            {t('auth.page-forgot-password.signin')}
          </p>
        </Link>
      </div>
    </div>
  )
}
