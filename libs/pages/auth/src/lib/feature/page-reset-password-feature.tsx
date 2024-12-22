import { useResetPasswordMutation } from '@beep/user'
import { useEffect, useState } from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import { PageResetPassword } from '../ui/page-reset-password'
import { useParams } from 'react-router'
import { useTranslation } from 'react-i18next'

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
  const { t } = useTranslation()
  const [verifyResetPassword, result] = useResetPasswordMutation()
  useEffect(() => {
    if (result.isLoading || (!result.data && !result.isError)) {
      return
    }
    if (result.isSuccess) {
      toast.success(t('auth.page-reset-password.success'))
      return
    }
    toast.error(t('auth.page-reset-password.fail'))
  }, [result])
  const onSubmit = methods.handleSubmit(async (data) => {
    if (data.password !== data.confirmPassword) {
      setError(t('auth.page-reset-password.no_match'))
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
