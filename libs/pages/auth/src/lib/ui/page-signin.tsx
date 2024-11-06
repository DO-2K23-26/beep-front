import { Button, InputText } from '@beep/ui'
import { KeyboardEventHandler } from 'react'
import { Controller, useFormContext } from 'react-hook-form'
import { Link } from 'react-router-dom'
import { QRCodeSVG } from 'qrcode.react'

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
  const { control } = useFormContext()
  const onKeyDown: KeyboardEventHandler<HTMLInputElement> = (e) =>
    e.key === 'Enter' ? onSubmit() : {}
  return (
    <div
      className="h-[100dvh] w-full bg-no-repeat bg-cover flex justify-center items-center"
      style={{ backgroundImage: `url('/background.svg')` }}
    >
      <div className="flex flex-row gap-20 justify-center items-center w-[700px] p-4">
        <div className="flex flex-col gap-6 justify-center items-start w-[400px] p-4">
          <h1 className="font-extrabold text-5xl">Beep</h1>
          <h5>We are happy to see you !</h5>
          <Controller
            name="email"
            rules={{
              required: 'Email is required',
              pattern: {
                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                message: 'Invalid email address',
              },
            }}
            control={control}
            render={({ field, fieldState: { error } }) => (
              <InputText
                label="Email"
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
              required: 'Password is required',
              minLength: {
                value: 8,
                message: 'Password must be at least 8 characters long',
              },
              maxLength: {
                value: 1000,
                message: 'Password must be at most 1000 characters long',
              },
            }}
            control={control}
            render={({ field, fieldState: { error } }) => (
              <InputText
                label="Password"
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
                You forgot your password ?
              </p>
            </Link>
          </div>
          <div className="flex flex-col w-full">
            <Button
              onClick={onSubmit}
              loading={loading}
              className="!bg-slate-800 hover:!bg-slate-900 w-full !rounded-lg min-h-[40px]"
            >
              <p className="text-violet-50">Sign in</p>
            </Button>
            {error && (
              <p className="mt-1 px-4 font-medium text-xs text-red-500">
                {error}
              </p>
            )}
          </div>
          <div className="flex flex-row gap-1">
            <p className="font-normal">Don't have an account ?</p>
            <Link
              className="text-purple-600 font-medium hover:!bg-transparent !p-0 !min-w-0 !h-fit"
              to="/authentication/signup"
            >
              <p className="text-purple-600 font-normal">Sign up</p>
            </Link>
          </div>
        </div>
        {qrCodeFeatureFlag && (
          <>
            <hr className="border-r-2 border-[#9382C2] h-[300px]" />
            <div className="flex flex-col gap-5 justify-center h-full p-4">
              <p>QRCode Login</p>
                <div className="flex flex-row gap-1 p-4 bg-white !rounded-lg">
                  <QRCodeSVG value={qrCodeLink} />
                </div>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
