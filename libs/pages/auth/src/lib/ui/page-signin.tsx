import { Button, InputText, LoaderSpinner } from '@beep/ui'
import { QRCodeSVG } from 'qrcode.react'
import { KeyboardEventHandler } from 'react'
import { Controller, useFormContext } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'

export interface PageSigninProps {
  onSubmit: () => void
  loading?: boolean
  toSignup?: () => void
  toForgetPassword?: () => void
  error?: string
  qrCodeFeatureFlag?: boolean
  qrCodeLink: string
}

export function PageSignin({
  onSubmit,
  loading,
  toSignup,
  toForgetPassword,
  error,
  qrCodeFeatureFlag,
  qrCodeLink,
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
    <div className="flex flex-row gap-6 justify-center items-center w-full p-4 ">
      <div className="flex flex-col gap-6 justify-center items-start w-5/6 sm:w-80 md:w-96">
        <h1 className="font-extrabold text-5xl">Beep</h1>
        <h5>{t('auth.page-signin.signin')}</h5>
        <Controller
          name="email"
          rules={{
            required: t('auth.page-signin.required_email'),
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
        <Link
          className="text-purple-600 font-medium hover:!bg-transparent !p-0 !min-w-0 !h-fit"
          to="/authentication/forgot-password"
        >
          <p className="text-purple-600 font-normal">
            {t('auth.page-signin.forgot_password')}
          </p>
        </Link>
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

      <hr className="lg:flex border-r-2 border-[#9382C2] h-[300px] hidden" />

      {qrCodeFeatureFlag && (
        <div className="lg:flex flex-col gap-5 justify-center items-center h-full p-4 hidden">
          <p>{t('auth.page-signin.qrcode')}</p>
          <div className="flex flex-row gap-1 p-4 bg-white !rounded-lg h-[160px] w-[160px]">
            {qrCodeLink && <QRCodeSVG value={qrCodeLink} />}
            {!qrCodeLink && (
              <div className="flex justify-center items-center w-[100%]">
                <LoaderSpinner />
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
