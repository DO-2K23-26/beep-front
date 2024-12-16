import { Controller, useFormContext } from 'react-hook-form'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import ContainerLight from './container-light'
import { Button, Input, Label } from '@beep/shadcn'
import { ArrowRight, Upload, X } from 'lucide-react'

export interface PageSignupProps {
  onSubmit: () => void
  loading: boolean
  error?: string
  addProfilePicture: (file: File) => void
  previewUrl: string | null
}

export function PageSignupV2({
  loading,
  error,
  onSubmit,
  addProfilePicture,
  previewUrl,
}: PageSignupProps) {
  const { t } = useTranslation()

  const { control, watch } = useFormContext()

  return (
    <div className="flex justify-center items-center p-4">
      <ContainerLight>
        <div className="flex flex-col gap-12 z-10">
          <div className="flex flex-col gap-3">
            <p className="font-bold text-grayV2">BEEP 0.1</p>
            <h1 className="font-extrabold text-whiteV2">
              {t('auth.page-signup.title')}
            </h1>
          </div>
          <div className="flex flex-col sm:flex-row gap-4 sm:gap-10">
            <div className="flex flex-col gap-4 max-w-3xl">
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
                  <div className="flex flex-col gap-2 group/input1">
                    <Label
                      htmlFor="firstname"
                      className="text-label-V2 group-hover/input1:text-label-hoverV2 group-focus-within/input1:text-label-hoverV2 font-medium text-xs transition-colors duration-200"
                    >
                      {t('auth.page-signup.firstname')}*
                    </Label>
                    <Input
                      type="text"
                      name="firstname"
                      placeholder="John"
                      className="text-whiteV2 font-medium border-input-borderV2  bg-input-backgroundV2 placeholder:text-input-placeholderV2 focus-visible:ring-primaryV2/25 focus-visible:ring-offset-primaryV2 focus-visible:ring-offset-1 focus-visible:ring-4"
                      value={field.value}
                      onChange={field.onChange}
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
                  <div className="flex flex-col gap-2 group/input2">
                    <Label
                      htmlFor="lastname"
                      className="text-label-V2 group-hover/input2:text-label-hoverV2 group-focus-within/input2:text-label-hoverV2 font-medium text-xs transition-colors duration-200"
                    >
                      {t('auth.page-signup.lastname')}*
                    </Label>
                    <Input
                      type="text"
                      name="lastname"
                      placeholder="Doe"
                      className="text-whiteV2 font-medium border-input-borderV2  bg-input-backgroundV2 placeholder:text-input-placeholderV2 focus-visible:ring-primaryV2/25 focus-visible:ring-offset-primaryV2 focus-visible:ring-offset-1 focus-visible:ring-4"
                      value={field.value}
                      onChange={field.onChange}
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
                  <div className="flex flex-col gap-2 group/input3">
                    <Label
                      htmlFor="lastname"
                      className="text-label-V2 group-hover/input3:text-label-hoverV2 group-focus-within/input3:text-label-hoverV2 font-medium text-xs transition-colors duration-200"
                    >
                      {t('auth.page-signup.username')}*
                    </Label>
                    <Input
                      type="text"
                      name="username"
                      placeholder="johndoe"
                      className="text-whiteV2 font-medium border-input-borderV2  bg-input-backgroundV2 placeholder:text-input-placeholderV2 focus-visible:ring-primaryV2/25 focus-visible:ring-offset-primaryV2 focus-visible:ring-offset-1 focus-visible:ring-4"
                      value={field.value}
                      onChange={field.onChange}
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
                  <div className="flex flex-col gap-2 group/input3">
                    <Label
                      htmlFor="email"
                      className="text-label-V2 group-hover/input3:text-label-hoverV2 group-focus-within/input3:text-label-hoverV2 font-medium text-xs transition-colors duration-200"
                    >
                      {t('auth.page-signup.email')}*
                    </Label>
                    <Input
                      type="email"
                      name="email"
                      placeholder="user@gmail.com"
                      className="text-whiteV2 font-medium border-input-borderV2  bg-input-backgroundV2 placeholder:text-input-placeholderV2 focus-visible:ring-primaryV2/25 focus-visible:ring-offset-primaryV2 focus-visible:ring-offset-1 focus-visible:ring-4"
                      value={field.value}
                      onChange={field.onChange}
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
            <div className="flex flex-col-reverse sm:flex-col gap-4">
              <div className="flex flex-col gap-2 group/input3 h-fit max-w-[120px]">
                <Label
                  htmlFor="file_upload"
                  className="text-label-V2 group-hover/input3:text-label-hoverV2 group-focus-within/input3:text-label-hoverV2 font-medium text-xs transition-colors duration-200 rounded-md"
                >
                  {t('auth.page-signup.profile_picture')}
                </Label>
                <Label
                  htmlFor="file_upload"
                  className="border-dashed cursor-pointer h-[120px] w-[120px] relative border-2 overflow-hidden border-input-borderV2 rounded-lg flex flex-col items-center justify-center transition-colors gap-2"
                >
                  <Upload color="#65687A" className="h-4 w-4 text-label-V2" />
                  <span className="text-label-V2 text-sm">Upload</span>
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
                    <div className="flex flex-col gap-2 group/input3">
                      <Label
                        htmlFor="password"
                        className="text-label-V2 group-hover/input3:text-label-hoverV2 group-focus-within/input3:text-label-hoverV2 font-medium text-xs transition-colors duration-200"
                      >
                        {t('auth.page-signup.password')}*
                      </Label>
                      <Input
                        type="password"
                        name="password"
                        placeholder={t('auth.page-signup.password')}
                        className="text-whiteV2 font-medium border-input-borderV2  bg-input-backgroundV2 placeholder:text-input-placeholderV2 focus-visible:ring-primaryV2/25 focus-visible:ring-offset-primaryV2 focus-visible:ring-offset-1 focus-visible:ring-4"
                        value={field.value}
                        onChange={field.onChange}
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
                    <div className="flex flex-col gap-2 group/input3">
                      <Label
                        htmlFor="confirm-password"
                        className="text-label-V2 group-hover/input3:text-label-hoverV2 group-focus-within/input3:text-label-hoverV2 font-medium text-xs transition-colors duration-200"
                      >
                        {t('auth.page-signup.confirm_password')}*
                      </Label>
                      <Input
                        type="password"
                        name="confirm-password"
                        placeholder={t('auth.page-signup.password')}
                        className="text-whiteV2 font-medium border-input-borderV2  bg-input-backgroundV2 placeholder:text-input-placeholderV2 focus-visible:ring-primaryV2/25 focus-visible:ring-offset-primaryV2 focus-visible:ring-offset-1 focus-visible:ring-4"
                        value={field.value}
                        onChange={field.onChange}
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
            <Button variant={'signin'} size={'signin'} onClick={onSubmit}>
              <p className="font-bold text-whiteV2">
                {t('auth.page-signup.signup')}
              </p>
              <ArrowRight
                className="w-6 h-6 text-whiteV2 font-bold"
                color="#FF82B6"
              />
            </Button>
          </div>
        </div>
      </ContainerLight>
    </div>
  )
}
