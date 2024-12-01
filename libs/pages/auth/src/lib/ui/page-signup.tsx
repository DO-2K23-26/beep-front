import { Button, InputText } from '@beep/ui'
import { Controller, useFormContext } from 'react-hook-form'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'

export interface PageSignupProps {
  onSubmit: () => void
  loading: boolean
  error?: string
  addProfilePicture: (file: File) => void
  previewUrl: string | null
}

export function PageSignup({
  loading,
  error,
  onSubmit,
  addProfilePicture,
  previewUrl,
}: PageSignupProps) {
  const { t } = useTranslation()

  const { control, watch } = useFormContext()

  return (
    <div
      className="h-[100dvh] w-full bg-no-repeat bg-cover flex justify-center"
      style={{ backgroundImage: `url('/background.svg')` }}
    >
      <div className="flex flex-col gap-6 justify-center items-start w-[400px] p-4">
        <h1 className="font-extrabold text-5xl">Beep</h1>
        <h5>{t('auth.page-signup.welcome_back')}</h5>
        <Controller
          name="firstname"
          rules={{
            required: t('auth.page-signup.required_firstname'),
            pattern: {
              value: /^[a-zA-ZÀ-ÿ]+$/,
              message: t('auth.page-signup.invalid_firstname'),
            },
          }}
          control={control}
          render={({ field, fieldState: { error } }) => (
            <InputText
              label={t('auth.page-signup.firstname')}
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
            required: t('auth.page-signup.required_lastname'),
            pattern: {
              value: /^[a-zA-ZÀ-ÿ]+$/,
              message: t('auth.page-signup.invalid_lastname'),
            },
          }}
          control={control}
          render={({ field, fieldState: { error } }) => (
            <InputText
              label={t('auth.page-signup.lastname')}
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
            required: t('auth.page-signup.required_username'),
            pattern: {
              value: /^[a-z]+$/,
              message: t('auth.page-signup.invalid_username'),
            },
          }}
          control={control}
          render={({ field, fieldState: { error } }) => (
            <InputText
              label={t('auth.page-signup.username')}
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
            required: t('auth.page-signup.required_email'),
            pattern: {
              value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
              message: t('auth.page-signup.invalid_email'),
            },
          }}
          control={control}
          render={({ field, fieldState: { error } }) => (
            <InputText
              label={t('auth.page-signup.email')}
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
            required: t('auth.page-signup.required_password'),
            pattern: {
              value:
                /^(?=.*[A-Z])(?=.*[0-9])(?=.*[!?@#$%^&*[|/\]{}()])(?=.{8,})/,
              message: t('auth.page-signup.invalid_password'),
            },
          }}
          control={control}
          render={({ field, fieldState: { error } }) => (
            <InputText
              label={t('auth.page-signup.password')}
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
            required: t('auth.page-signup.required_confirm_password'),
            validate: (val: string) => {
              if (val !== watch('password')) {
                return t('auth.page-signup.password_mismatch')
              }
            },
          }}
          control={control}
          render={({ field, fieldState: { error } }) => (
            <InputText
              label={t('auth.page-signup.confirm_password')}
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
          <p>{t('auth.page-signup.profile_picture')}</p>
        </label>
        <input
          id="file_upload"
          type="file"
          className="hidden"
          accept="image/*"
          onChange={(e) => {
            addProfilePicture(e.target?.files![0])
          }}
        />
        {previewUrl && (
          <div className="flex justify-center items-center w-full">
            <img
              src={previewUrl}
              alt="profile"
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
            <p className="text-violet-50">{t('auth.page-signup.signup')}</p>
          </Button>
          {error && (
            <p className="mt-1 px-4 font-medium text-xs text-red-500">
              {error}
            </p>
          )}
        </div>
        <div className="flex flex-row gap-1">
          <p className="font-normal">{t('auth.page-signup.already_account')}</p>
          <Link
            className="text-purple-600 font-medium hover:!bg-transparent !p-0 !min-w-0 !h-fit"
            to="/authentication/signin"
          >
            <p className="text-purple-600 font-normal">
              {t('auth.page-signup.signin')}
            </p>
          </Link>
        </div>
      </div>
    </div>
  )
}
