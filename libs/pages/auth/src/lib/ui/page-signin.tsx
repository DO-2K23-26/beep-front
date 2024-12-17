import { Button, Input, Label } from '@beep/shadcn'
import { LoaderSpinner } from '@beep/ui'
import { ArrowRight, X } from 'lucide-react'
import { QRCodeSVG } from 'qrcode.react'
import { KeyboardEventHandler } from 'react'
import { Controller, useFormContext } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import ContainerLight from './container-light'

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
    <div className="flex justify-center items-center p-4">
      {/* Container */}
      <ContainerLight>
        {/* Login */}
        <div className="flex flex-col gap-12 z-10 max-w-3xl">
          <div className="flex flex-col gap-3">
            <p className="font-bold text-grayV2">BEEP 0.1</p>
            <h1 className="font-extrabold text-whiteV2">
              {t('auth.page-signin.title')}
            </h1>
          </div>
          <div className="flex flex-col gap-4">
            <Controller
              name="email"
              rules={{
                required: t('auth.page-signin.required_email'),
              }}
              control={control}
              render={({ field, fieldState: { error } }) => (
                <div className="flex flex-col gap-2 group/input1">
                  <Label
                    htmlFor="email"
                    className="text-label-V2 group-hover/input1:text-label-hoverV2 group-focus-within/input1:text-label-hoverV2 font-medium text-xs transition-colors duration-200"
                  >
                    {t('auth.page-signin.email')}
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    name="email"
                    placeholder="user@gmail.com"
                    value={field.value}
                    onChange={field.onChange}
                    onKeyDown={onKeyDown}
                    className="text-whiteV2 font-medium border-input-borderV2  bg-input-backgroundV2 placeholder:text-input-placeholderV2 focus-visible:ring-primaryV2/25 focus-visible:ring-offset-primaryV2 focus-visible:ring-offset-1 focus-visible:ring-4"
                  />
                  {error && (
                    <div className="flex flex-row gap-1 px-4">
                      <X color="#FC3B8C" className="w-4 h-4" />
                      <p className="font-medium text-xs text-primaryV2">
                        {error?.message}
                      </p>
                    </div>
                  )}
                </div>
              )}
            />
            <Controller
              name="password"
              rules={{
                required: t('auth.page-signin.required_password'),
              }}
              control={control}
              render={({ field, fieldState: { error } }) => (
                <div className="flex flex-col gap-2 group/input2">
                  <div className="flex flex-row justify-between">
                    <Label
                      htmlFor="password"
                      className="text-label-V2 group-hover/input2:text-label-hoverV2 group-focus-within/input1:text-label-hoverV2 font-medium text-xs transition-colors duration-200"
                    >
                      {t('auth.page-signin.password')}
                    </Label>
                    <Link
                      className="text-primaryV2/90 hover:text-primaryV2 font-medium text-xs"
                      to="/authentication/forgot-password"
                    >
                      {t('auth.page-signin.forgot_password')}
                    </Link>
                  </div>
                  <Input
                    id="password"
                    type="password"
                    name="password"
                    placeholder={t('auth.page-signin.password')}
                    value={field.value}
                    onChange={field.onChange}
                    onKeyDown={onKeyDown}
                    className="text-whiteV2 font-medium border-input-borderV2  bg-input-backgroundV2 placeholder:text-input-placeholderV2 focus-visible:ring-primaryV2/25 focus-visible:ring-offset-primaryV2 focus-visible:ring-offset-1 focus-visible:ring-4"
                  />
                  {error && (
                    <div className="flex flex-row gap-1 px-4">
                      <X color="#FC3B8C" className="w-4 h-4" />
                      <p className="font-medium text-xs text-primaryV2">
                        {error?.message}
                      </p>
                    </div>
                  )}
                </div>
              )}
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
      </ContainerLight>
    </div>
  )
}
