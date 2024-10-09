import { Button, InputText } from '@beep/ui'
import { Controller, useFormContext } from 'react-hook-form'
import { Link } from 'react-router-dom'

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
  const { control, watch } = useFormContext()

  return (
    <div
      className="h-[100dvh] w-full bg-no-repeat bg-cover flex justify-center"
      style={{ backgroundImage: `url('/background.svg')` }}
    >
      <div className="flex flex-col gap-6 justify-center items-start w-[600px] p-4">
        <h1 className="font-extrabold text-5xl">Reset your password</h1>
        <h5>Please enter your new password below.</h5>
        <Controller
          name="password"
          rules={{
            required: 'Password is required',
            pattern: {
              value:
                /^(?=.*[A-Z])(?=.*[0-9])(?=.*[!?@#$%^&*[|/\]{}()])(?=.{8,})/,
              message:
                'Password must be at least 8 characters long and contain at least one uppercase letter, one digit, and one special character',
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
            />
          )}
        />
        <Controller
          name="confirmPassword"
          rules={{
            required: 'You must confirm your password',
            validate: (val: string) => {
              if (val !== watch('password')) {
                return 'Your passwords do not match'
              }
            },
          }}
          control={control}
          render={({ field, fieldState: { error } }) => (
            <InputText
              label="Confirm password"
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
            <p className="text-violet-50">Submit</p>
          </Button>
          {error && (
            <p className="mt-1 px-4 font-medium text-xs text-red-500">
              {error}
            </p>
          )}
        </div>
        <div className="flex flex-row gap-1">
          <p className="font-normal">Go back to signin page?</p>
          <Link
            className="text-purple-600 font-medium hover:!bg-transparent !p-0 !min-w-0 !h-fit"
            to="/authentication/signin"
          >
            <p className="text-purple-600 font-normal">Sign in</p>
          </Link>
        </div>
      </div>
    </div>
  )
}
