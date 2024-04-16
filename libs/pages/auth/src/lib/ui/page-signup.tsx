import { Button, ButtonStyle, InputText } from '@beep/ui'
import { Controller, useFormContext } from 'react-hook-form'

export interface PageSignupProps {
  onSubmit: () => void
  loading?: boolean
  toSignin?: () => void
  error?: string
}

export function PageSignup({
  loading,
  error,
  onSubmit,
  toSignin,
}: PageSignupProps) {
  const { control, watch } = useFormContext()
  return (
    <div
      className="h-[100dvh] w-full bg-no-repeat bg-cover flex justify-center"
      style={{ backgroundImage: `url('/background.svg')` }}
    >
      <div className="flex flex-col gap-6 justify-center items-start w-[400px] p-4">
        <h1 className="font-extrabold text-5xl">Beep</h1>
        <h5>We are happy to see you !</h5>
        <Controller
          name="firstname"
          rules={{
            required: 'First name is required',
            pattern: {
              value: /^[a-zA-Z]+$/,
              message:
                'First name should only contain letters of the alphabet (uppercase or lowercase)',
            },
          }}
          control={control}
          render={({ field, fieldState: { error } }) => (
            <InputText
              label="First name"
              type="text"
              name="firstname"
              className="w-full !rounded-lg min-h-[40px]"
              value={field.value}
              onChange={field.onChange}
              error={error?.message}
            />
          )}
        />
        <Controller
          name="lastname"
          rules={{
            required: 'Last name is required',
            pattern: {
              value: /^[a-zA-Z]+$/,
              message:
                'Last name should only contain letters of the alphabet (uppercase or lowercase)',
            },
          }}
          control={control}
          render={({ field, fieldState: { error } }) => (
            <InputText
              label="Last name"
              type="text"
              name="lastname"
              className="w-full !rounded-lg min-h-[40px]"
              value={field.value}
              onChange={field.onChange}
              error={error?.message}
            />
          )}
        />
        <Controller
          name="username"
          rules={{
            required: 'Username is required',
            pattern: {
              value: /^[a-z]+$/,
              message:
                'Username should only contain lowercase letters of the alphabet',
            },
          }}
          control={control}
          render={({ field, fieldState: { error } }) => (
            <InputText
              label="Username"
              type="text"
              name="username"
              className="w-full !rounded-lg min-h-[40px]"
              value={field.value}
              onChange={field.onChange}
              error={error?.message}
            />
          )}
        />
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
            />
          )}
        />
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
          name="confirm-password"
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
              name="confirm-password"
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
            <p className="text-violet-50">Sign up</p>
          </Button>
          {error && (
            <p className="mt-1 px-4 font-medium text-xs text-red-500">
              {error}
            </p>
          )}
        </div>
        <div className="flex flex-row gap-1">
          <p className="font-normal">Already have an account ?</p>
          <Button
            style={ButtonStyle.NONE}
            className="text-purple-600 font-medium hover:!bg-transparent !p-0 !min-w-0 !h-fit"
            onClick={toSignin}
          >
            <p className="text-purple-600 font-normal">Sign in</p>
          </Button>
        </div>
      </div>
    </div>
  )
}
