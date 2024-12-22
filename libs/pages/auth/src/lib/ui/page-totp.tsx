import { KeyboardEventHandler } from 'react'
import { useTranslation } from 'react-i18next'
import { Control, Controller } from 'react-hook-form'
import { ArrowRight, X } from 'lucide-react'
import {
  Button,
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from '@beep/shadcn'
import { Link } from 'react-router-dom'
import { AuthHeader } from './auth-header'

export interface PageTotpProps {
  onSubmit: () => void
  loading?: boolean
  toSignup?: () => void
  error?: string
  control?: Control<{ totp: string }>
}

export function PageTotp({
  onSubmit,
  loading,
  toSignup,
  error,
  control,
}: PageTotpProps) {
  const { t } = useTranslation()

  const onKeyDown: KeyboardEventHandler<HTMLInputElement> = (e) =>
    e.key === 'Enter' ? onSubmit() : {}

  return (
    <div className="flex flex-col gap-12 z-10 max-w-3xl">
      <AuthHeader
        title={t('auth.page-totp.verify-identity')}
        description={t('auth.page-totp.application-otp')}
      />
      <div className="flex flex-col items-center gap-4 max-w-3xl">
        {control && (
          <Controller
            name="totp"
            control={control}
            render={({ field }) => (
              <InputOTP
                maxLength={6}
                onKeyDown={onKeyDown}
                value={field.value}
                onChange={field.onChange}
              >
                <InputOTPGroup>
                  <InputOTPSlot
                    className="text-whiteV2 font-medium border-input-borderV2  bg-input-backgroundV2 ring-primaryV2/75"
                    index={0}
                  />
                  <InputOTPSlot
                    className="text-whiteV2 font-medium border-input-borderV2  bg-input-backgroundV2 ring-primaryV2/75"
                    index={1}
                  />
                  <InputOTPSlot
                    className="text-whiteV2 font-medium border-input-borderV2  bg-input-backgroundV2 ring-primaryV2/75"
                    index={2}
                  />
                </InputOTPGroup>
                <InputOTPSeparator />
                <InputOTPGroup>
                  <InputOTPSlot
                    className="text-whiteV2 font-medium border-input-borderV2  bg-input-backgroundV2 ring-primaryV2/75"
                    index={3}
                  />
                  <InputOTPSlot
                    className="text-whiteV2 font-medium border-input-borderV2  bg-input-backgroundV2 ring-primaryV2/75"
                    index={4}
                  />
                  <InputOTPSlot
                    className="text-whiteV2 font-medium border-input-borderV2  bg-input-backgroundV2 ring-primaryV2/75"
                    index={5}
                  />
                </InputOTPGroup>
              </InputOTP>
            )}
          />
        )}
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
            {t('auth.page-totp.go_back_signin')}
          </p>
          <Link
            className="text-primaryV2/90 hover:text-primaryV2"
            to="/authentication/signin"
          >
            {t('auth.page-totp.signin')}
          </Link>
        </div>
        <Button variant={'signin'} size={'signin'} onClick={onSubmit}>
          <p className="font-bold text-whiteV2">{t('auth.page-totp.button')}</p>
          <ArrowRight
            className="w-6 h-6 text-whiteV2 font-bold"
            color="#FF82B6"
          />
        </Button>
      </div>
    </div>
  )
}
