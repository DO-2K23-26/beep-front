import { Button, ButtonStyle, Icon, InputText } from '@beep/ui'
import { Controller, useFormContext } from 'react-hook-form'
import { Link } from 'react-router-dom'

export interface PageSignupProps {
  onSubmit: () => void
  loading: boolean
  toSignin?: () => void
  error?: string
  addProfilePicture: (file: File) => void
  previewUrl: string | null
}

export function PageSignup({
  loading,
  error,
  onSubmit,
  toSignin,
  addProfilePicture,
  previewUrl,
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

        <label
          htmlFor="file_upload"
          className="w-full h-fit input !cursor-pointer !rounded-lg !bg-violet-50 flex flex-col justify-center items-center"
        >
          <p>Profile picture</p>
        </label>
        <input
          id="file_upload"
          type="file"
          className="hidden"
          accept="image/*"
          onChange={(e) => {
            console.log(e.target?.files)
            addProfilePicture(e.target?.files![0])
          }}
        />
        {previewUrl && (
          <div className="flex justify-center items-center w-full">
            <img
              src={previewUrl}
              alt="profile-picture"
              className="w-40 h-40 bg-violet-50 flex justify-center items-center border-2 border-black rounded-2xl"
            />
          </div>
        )}

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
