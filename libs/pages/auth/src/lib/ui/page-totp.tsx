import {
  Button,
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from '@beep/ui'
import { KeyboardEventHandler } from 'react'
import { useTranslation } from 'react-i18next'
import { Control, Controller } from 'react-hook-form'

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
    <div className="flex flex-col gap-6 justify-center items-start w-[400px] p-4">
      <h1 className="font-extrabold text-5xl">Beep</h1>
      <h5 className="font-semibold">{t('auth.page-totp.verify-identity')}</h5>
      <h5>{t('auth.page-totp.application-otp')}</h5>
      <div className="w-full flex justify-center">
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
                    className="bg-violet-50 border-slate-400"
                    index={0}
                  />
                  <InputOTPSlot
                    className="bg-violet-50 border-slate-400"
                    index={1}
                  />
                  <InputOTPSlot
                    className="bg-violet-50 border-slate-400"
                    index={2}
                  />
                </InputOTPGroup>
                <InputOTPSeparator />
                <InputOTPGroup>
                  <InputOTPSlot
                    className="bg-violet-50 border-slate-400"
                    index={3}
                  />
                  <InputOTPSlot
                    className="bg-violet-50 border-slate-400"
                    index={4}
                  />
                  <InputOTPSlot
                    className="bg-violet-50 border-slate-400"
                    index={5}
                  />
                </InputOTPGroup>
              </InputOTP>
            )}
          />
        )}
      </div>

      <div className="flex flex-col w-full">
        <Button
          onClick={onSubmit}
          loading={loading}
          className="!bg-slate-800 hover:!bg-slate-900 w-full !rounded-lg min-h-[40px]"
        >
          <p className="text-violet-50">{t('auth.page-totp.button')}</p>
        </Button>
        {error && (
          <p className="mt-1 px-4 font-medium text-xs text-red-500">{error}</p>
        )}
      </div>
    </div>
  )
}
