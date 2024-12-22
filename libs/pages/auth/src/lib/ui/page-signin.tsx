import { Button } from '@beep/shadcn'
import { LoaderSpinner } from '@beep/ui'
import { ArrowRight, X } from 'lucide-react'
import { QRCodeSVG } from 'qrcode.react'
import { KeyboardEventHandler } from 'react'
import { useFormContext } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import { FormField } from './form-field'
import { AuthHeader } from './auth-header'

export interface PageSigninProps {
  onSubmit: () => void
  error?: string
  qrCodeFeatureFlag?: boolean
  qrCodeLink: string
}

export function PageSignin({
  onSubmit,
  error,
  qrCodeFeatureFlag,
  qrCodeLink,
}: PageSigninProps) {
  const { t } = useTranslation()
  const { control } = useFormContext()
  const onKeyDown: KeyboardEventHandler<HTMLInputElement> = (e) =>
    e.key === 'Enter' ? onSubmit() : {}

  return (
    <>
      {/* Login */}
      <div className="flex flex-col gap-12 z-10 max-w-3xl">
        <AuthHeader title={t('auth.page-signin.title')} />
        <div className="flex flex-col gap-4">
          <FormField
            control={control}
            name="email"
            type="email"
            label={t('auth.page-signin.email')}
            placeholder="user@gmail.com"
            onKeyDown={onKeyDown}
            rules={{
              required: t('auth.page-signin.required_email'),
            }}
          />
          <FormField
            control={control}
            name="password"
            type="password"
            label={t('auth.page-signin.password')}
            placeholder={t('auth.page-signin.password')}
            onKeyDown={onKeyDown}
            rules={{
              required: t('auth.page-signin.required_password'),
            }}
            headerContent={
              <Link
                className="text-primaryV2/90 hover:text-primaryV2 font-medium text-xs"
                to="/authentication/forgot-password"
              >
                {t('auth.page-signin.forgot_password')}
              </Link>
            }
          />
          {error && (
            <div className="flex flex-row gap-1 px-4">
              <X color="#FC3B8C" className="w-4 h-4" />
              <p className="font-medium text-xs text-primaryV2">{error}</p>
            </div>
          )}
        </div>
        <div className="flex flex-col sm:flex-row justify-between item sm:items-center gap-6 sm:gap-12">
          <div className="flex flex-row w-full gap-1 font-bold text-sm">
            <p className="text-text-grayV2">
              {t('auth.page-signin.no_account')}
            </p>
            <Link
              className="text-primaryV2/90 hover:text-primaryV2"
              to="/authentication/signup"
            >
              {t('auth.page-signin.signup')}
            </Link>
          </div>
          <Button variant={'signin'} size={'signin'} onClick={onSubmit}>
            <p className="font-bold text-whiteV2">
              {t('auth.page-signin.signin')}
            </p>
            <ArrowRight
              className="w-6 h-6 text-whiteV2 font-bold"
              color="#FF82B6"
            />
          </Button>
        </div>
      </div>

      {/* QRCode */}
      {qrCodeFeatureFlag && (
        <div className="lg:flex flex-col z-10 gap-12 justify-center items-center h-full hidden max-w-xs">
          <div className="flex flex-row gap-1 p-4 bg-whiteV2 !rounded-lg h-[160px] w-[160px]">
            {qrCodeLink && <QRCodeSVG value={qrCodeLink} />}
            {!qrCodeLink && (
              <div className="flex justify-center items-center w-[100%]">
                <LoaderSpinner />
              </div>
            )}
          </div>
          <div className="flex flex-col gap-4">
            <h3 className="text-whiteV2 text-center font-semibold">
              {t('auth.page-signin.qrcode_title')}
            </h3>
            <p className="text-text-grayV2 text-base text-center">
              {t('auth.page-signin.qrcode_description')}
            </p>
          </div>
        </div>
      )}
    </>
  )
}
