import { useResetPasswordMutation } from '@beep/user'
import { useState } from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import { PageForgotPassword } from '../ui/page-forgot-password'

export function PageForgotPasswordFeature() {
  const [reset, result] = useResetPasswordMutation()
  const [error] = useState('')
  const methods = useForm({
    mode: 'onChange',
    defaultValues: {
      email: '',
    },
  })

  const onSubmit = methods.handleSubmit((data) => {
    reset({ email: data.email })
    toast(
      'If this email address is in our records, a reset link will be sent. Please check your inbox.'
    )
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
