import { useForm } from 'react-hook-form'
import { PageTotp } from '../ui/page-totp'
// import { LoginRequest } from '@beep/contracts'
import { getUserState, useLoginMutation, userActions } from '@beep/user'
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { LoginRequest } from '@beep/contracts'
import { useLocation, useNavigate } from 'react-router'
import { useDispatch, useSelector } from 'react-redux'
import { AppDispatch } from '@beep/store'

export default function PageTotpFeature() {
  const { control, handleSubmit, watch } = useForm({
    mode: 'onChange',
    defaultValues: {
      totp: '',
    },
  })
  const navigate = useNavigate()
  const { isAuthenticated } = useSelector(getUserState)
  const [error, setError] = useState('')
  const { t } = useTranslation()
  const [login, result] = useLoginMutation()
  const dispatch = useDispatch<AppDispatch>()

  const location = useLocation()
  const state = location.state

  const totpValue = watch('totp')

  const onSubmit = handleSubmit((data) => {
    if (totpValue.length === 6) {
      setError('')
      login({
        email: state?.email,
        password: state?.password,
        totpToken: data.totp,
      } as LoginRequest)
    } else {
      setError(t('auth.page-totp.error-enter-6-digits'))
    }
  })

  useEffect(() => {
    if (isAuthenticated) {
      const redirectTo = location.state?.from?.pathname || '/servers/discover'
      navigate(redirectTo, { replace: true })
    }
  }, [isAuthenticated, location.state?.from?.pathname, navigate])

  useEffect(() => {
    if (result?.isSuccess && result?.status === 'fulfilled') {
      dispatch(userActions.updateIsLoading(false))
      dispatch(userActions.setTokens(result.data.tokens))
    }
    if (result?.isError) {
      setError(t('auth.page-totp.error-totp-invalid'))
    }
  }, [result, t, dispatch])

  return (
    <PageTotp
      onSubmit={onSubmit}
      loading={result.isLoading}
      error={error}
      control={control}
    />
  )
}
