import { useSendResetPasswordMailMutation } from '@beep/user'
import { useState } from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import { PageForgotPassword } from '../ui/page-forgot-password'
import { useTranslation } from 'react-i18next'

export function PageForgotPasswordFeature() {
  const [reset, result] = useSendResetPasswordMailMutation()
  const [error] = useState('')
  const { t } = useTranslation()
  const methods = useForm({
    mode: 'onChange',
    defaultValues: {
      email: '',
    },
  })

  const onSubmit = methods.handleSubmit((data) => {
    reset({
      email: data.email,
    })
    toast(t('auth.page-forgot-password.email_sent'))
    methods.reset()
  })

  return (
    <FormProvider {...methods}>
      <PageForgotPassword
        onSubmit={onSubmit}
        loading={result.isLoading}
        error={error}
      />
    </FormProvider>
  )
}
