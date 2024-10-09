import { useResetPasswordMutation } from '@beep/user'
import { useEffect, useState } from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import { PageResetPassword } from '../ui/page-reset-password'
import { useParams } from 'react-router'

export function PageResetPasswordFeature() {
  const [error, setError] = useState('')
  const methods = useForm({
    mode: 'onChange',
    defaultValues: {
      password: '',
      confirmPassword: '',
    },
  })

  const { token = '' } = useParams<{ token: string }>()
  const [verifyResetPassword, result] = useResetPasswordMutation()
  useEffect(() => {
    if (result.isLoading || (!result.data && !result.isError)) {
      return
    }
    if (result.isSuccess) {
      toast.success('Password has been reset successfully.')
      return
    }
    toast.error('Failed to reset password.')
  }, [result])
  const onSubmit = methods.handleSubmit(async (data) => {
    if (data.password !== data.confirmPassword) {
      setError('Passwords do not match')
      return
    }
    verifyResetPassword({
      token,
      newPassword: data.password,
    })
    methods.reset()
  })

  return (
    <FormProvider {...methods}>
      <PageResetPassword
        onSubmit={onSubmit}
        loading={result.isLoading}
        error={error}
      />
    </FormProvider>
  )
}
