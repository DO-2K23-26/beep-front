import { Button, InputText } from '@beep/ui'
import { KeyboardEventHandler } from 'react'
import { Controller, useFormContext } from 'react-hook-form'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'

export interface PageSigninProps {
  onSubmit: () => void
  loading?: boolean
  toSignup?: () => void
  toForgetPassword?: () => void
  error?: string
}

export function PageSignin({
  onSubmit,
  loading,
  toSignup,
  toForgetPassword,
  error,
}: PageSigninProps) {
  const { t } = useTranslation()

  const { control } = useFormContext()
  const onKeyDown: KeyboardEventHandler<HTMLInputElement> = (e) =>
    e.key === 'Enter' ? onSubmit() : {}

  // const lngs: { [key: string]: string } = {
  //   en: 'English',
  //   fr: 'Français',
  // }
  return (
    <div
      className="h-dvh w-full bg-no-repeat bg-cover flex justify-center"
      style={{ backgroundImage: `url('/background.svg')` }}
    >
      {/* {Object.keys(lngs).map((lng: string) => {
        return (
          //a supprimer à l'avenir
          <button
            key={lng}
            onClick={() => {
              localStorage.setItem('i18nextLng', lng)
              i18n.changeLanguage(lng)
            }}
            className="text-gray-800"
          >
            {lngs[lng]}
          </button>
        )
      })} */}
      <div className="flex flex-col gap-6 justify-center items-start w-[400px] p-4">
        <h1 className="font-extrabold text-5xl">Beep</h1>
        <h5>{t('auth.page-signin.signin')}</h5>
        <Controller
          name="email"
          rules={{
            required: t('auth.page-signin.required_email'),
            pattern: {
              value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
              message: t('auth.page-signin.invalid_email'),
            },
          }}
          control={control}
          render={({ field, fieldState: { error } }) => (
            <InputText
              label={t('auth.page-signin.email')}
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
        <Controller
          name="password"
          rules={{
            required: t('auth.page-signin.required_password'),
            minLength: {
              value: 8,
              message: t('auth.page-signin.invalid_password_min'),
            },
            maxLength: {
              value: 1000,
              message: t('auth.page-signin.invalid_password_max'),
            },
          }}
          control={control}
          render={({ field, fieldState: { error } }) => (
            <InputText
              label={t('auth.page-signin.password')}
              type="password"
              name="password"
              className="w-full !rounded-lg min-h-[40px]"
              value={field.value}
              onChange={field.onChange}
              error={error?.message}
              onKeyDown={onKeyDown}
            />
          )}
        />
        <div className="flex flex-row gap-1">
          <Link
            className="text-purple-600 font-medium hover:!bg-transparent !p-0 !min-w-0 !h-fit"
            to="/authentication/forgot-password"
          >
            <p className="text-purple-600 font-normal">
              {t('auth.page-signin.forgot_password')}
            </p>
          </Link>
        </div>
        <div className="flex flex-col w-full">
          <Button
            onClick={onSubmit}
            loading={loading}
            className="!bg-slate-800 hover:!bg-slate-900 w-full !rounded-lg min-h-[40px]"
          >
            <p className="text-violet-50">{t('auth.page-signin.signin')}</p>
          </Button>
          {error && (
            <p className="mt-1 px-4 font-medium text-xs text-red-500">
              {error}
            </p>
          )}
        </div>
        <div className="flex flex-row gap-1">
          <p className="font-normal">{t('auth.page-signin.no_account')}</p>
          <Link
            className="text-purple-600 font-medium hover:!bg-transparent !p-0 !min-w-0 !h-fit"
            to="/authentication/signup"
          >
            <p className="text-purple-600 font-normal">
              {t('auth.page-signin.signup')}
            </p>
          </Link>
        </div>
      </div>
    </div>
  )
}
