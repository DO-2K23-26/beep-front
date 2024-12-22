import { useFormContext } from 'react-hook-form'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { Label } from '@beep/shadcn'
import { Upload } from 'lucide-react'
import { FormField } from './form-field'
import { AuthHeader } from './auth-header'
import AuthButton from './auth-button'
import AuthError from './auth-error'

export interface PageSignupProps {
  onSubmit: () => void
  error?: string
  addProfilePicture: (file: File) => void
  previewUrl: string | null
}

export function PageSignup({
  error,
  onSubmit,
  addProfilePicture,
  previewUrl,
}: PageSignupProps) {
  const { t } = useTranslation()

  const { control, watch } = useFormContext()

  return (
    <div className="flex flex-col gap-12 z-10">
      <AuthHeader title={t('auth.page-signup.title')} />
      <div className="flex flex-col sm:flex-row gap-4 sm:gap-10">
        <div className="flex flex-col gap-4 max-w-3xl">
          <FormField
            control={control}
            name="firstname"
            type="text"
            label={`${t('auth.page-signup.firstname')}*`}
            placeholder="John"
            rules={{
              required: t('auth.page-signup.required_firstname'),
              pattern: {
                value: /^[a-zA-ZÀ-ÿ]+$/,
                message: t('auth.page-signup.invalid_firstname'),
              },
            }}
          />
          <FormField
            control={control}
            name="lastname"
            type="text"
            label={`${t('auth.page-signup.lastname')}*`}
            placeholder="Doe"
            rules={{
              required: t('auth.page-signup.required_lastname'),
              pattern: {
                value: /^[a-zA-ZÀ-ÿ]+$/,
                message: t('auth.page-signup.invalid_lastname'),
              },
            }}
          />
          <FormField
            control={control}
            name="username"
            type="text"
            label={`${t('auth.page-signup.username')}*`}
            placeholder="johndoe"
            rules={{
              required: t('auth.page-signup.required_username'),
              pattern: {
                value: /^[a-z]+$/,
                message: t('auth.page-signup.invalid_username'),
              },
            }}
          />
          <FormField
            control={control}
            name="email"
            type="email"
            label={`${t('auth.page-signup.email')}*`}
            placeholder="user@gmail.com"
            rules={{
              required: t('auth.page-signup.required_email'),
              pattern: {
                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                message: t('auth.page-signup.invalid_email'),
              },
            }}
          />
          {error && <AuthError error={error} />}
        </div>
        <div className="flex flex-col-reverse sm:flex-col gap-4">
          <div className="flex flex-col gap-2 group/input h-fit max-w-[120px]">
            <Label
              htmlFor="file_upload"
              className="text-labelV2 group-hover/input:text-label-hoverV2 group-focus-within/input:text-label-hoverV2 font-medium text-xs transition-colors duration-200 rounded-md"
            >
              {t('auth.page-signup.profile_picture')}
            </Label>
            <Label
              htmlFor="file_upload"
              className="border-dashed cursor-pointer h-[120px] w-[120px] relative border-2 overflow-hidden border-input-borderV2 rounded-lg flex flex-col items-center justify-center transition-colors gap-2"
            >
              <Upload color="#65687A" className="h-4 w-4 text-labelV2" />
              <span className="text-labelV2 text-sm">Upload</span>
              {previewUrl && (
                <img
                  src={previewUrl}
                  alt="profile"
                  className="absolute bg-violet-50 flex justify-center items-center rounded-md"
                />
              )}
            </Label>
          </div>
          <input
            id="file_upload"
            type="file"
            className="hidden"
            accept="image/*"
            onChange={(e) => {
              addProfilePicture(e.target?.files![0])
            }}
          />
          <div className="flex flex-col gap-4">
            <FormField
              control={control}
              name="password"
              type="password"
              label={`${t('auth.page-signup.password')}*`}
              placeholder={t('auth.page-signup.password')}
              rules={{
                required: t('auth.page-signup.required_password'),
                pattern: {
                  value:
                    /^(?=.*[A-Z])(?=.*[0-9])(?=.*[!?@#$%^&*[|/\]{}()])(?=.{8,})/,
                  message: t('auth.page-signup.invalid_password'),
                },
              }}
            />
            <FormField
              control={control}
              name="confirm-password"
              type="password"
              label={`${t('auth.page-signup.confirm_password')}*`}
              placeholder={t('auth.page-signup.password')}
              rules={{
                required: t('auth.page-signup.required_confirm_password'),
                validate: (val: string) => {
                  if (val !== watch('password')) {
                    return t('auth.page-signup.password_mismatch')
                  }
                },
              }}
            />
          </div>
        </div>
      </div>
      <div className="flex flex-col sm:flex-row justify-between item sm:items-center gap-6 sm:gap-12">
        <div className="flex flex-row gap-1 font-bold text-sm">
          <p className="text-text-grayV2">
            {t('auth.page-signup.already_account')}
          </p>
          <Link
            className="text-primaryV2/90 hover:text-primaryV2"
            to="/authentication/signin"
          >
            {t('auth.page-signup.signin')}
          </Link>
        </div>
        <AuthButton onSubmit={onSubmit} text={t('auth.page-signup.signup')} />
      </div>
    </div>
  )
}
