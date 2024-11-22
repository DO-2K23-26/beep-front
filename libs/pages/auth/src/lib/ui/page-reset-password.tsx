import { Button, InputText } from '@beep/ui'
import { Controller, useFormContext } from 'react-hook-form'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'

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
    <div
      className="h-[100dvh] w-full bg-no-repeat bg-cover flex justify-center"
      style={{ backgroundImage: `url('/background.svg')` }}
    >
      <div className="flex flex-col gap-6 justify-center items-start w-[600px] p-4">
        <h1 className="font-extrabold text-5xl">
          {t('auth.page-reset-password.reset')}
        </h1>
        <h5>{t('auth.page-reset-password.new_password')}</h5>
        <Controller
          name="password"
          rules={{
            required: t('auth.page-reset-password.required_password'),
            pattern: {
              value:
                /^(?=.*[A-Z])(?=.*[0-9])(?=.*[!?@#$%^&*[|/\]{}()])(?=.{8,})/,
              message: t('auth.page-reset-password.invalid_password'),
            },
          }}
          control={control}
          render={({ field, fieldState: { error } }) => (
            <InputText
              label={t('auth.page-reset-password.password')}
              type="password"
              name="password"
              className="w-full !rounded-lg min-h-[40px]"
              value={field.value}
              onChange={field.onChange}
              error={error?.message}
            />
          )}
        />
        <Controller
          name="confirmPassword"
          rules={{
            required: t('auth.page-reset-password.required_confirm_password'),
            validate: (val: string) => {
              if (val !== watch('password')) {
                return t('auth.page-reset-password.password_mismatch')
              }
            },
          }}
          control={control}
          render={({ field, fieldState: { error } }) => (
            <InputText
              label={t('auth.page-reset-password.password_mismatch')}
              type="password"
              name="confirmPassword"
              className="w-full !rounded-lg min-h-[40px]"
              value={field.value}
              onChange={field.onChange}
              error={error?.message}
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
              {t('auth.page-reset-password.submit')}
            </p>
          </Button>
          {error && (
            <p className="mt-1 px-4 font-medium text-xs text-red-500">
              {error}
            </p>
          )}
        </div>
        <div className="flex flex-row gap-1">
          <p className="font-normal">
            {t('auth.page-reset-password.go_back_signin')}
          </p>
          <Link
            className="text-purple-600 font-medium hover:!bg-transparent !p-0 !min-w-0 !h-fit"
            to="/authentication/signin"
          >
            <p className="text-purple-600 font-normal">
              {t('auth.page-reset-password.signin')}
            </p>
          </Link>
        </div>
      </div>
    </div>
  )
}
