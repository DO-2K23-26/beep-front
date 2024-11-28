import { useEffect, useState } from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import { PageSignin } from '../ui/page-signin'
import { useLocation, useNavigate } from 'react-router-dom'
import { LoginRequest } from '@beep/contracts'
import { AppDispatch } from '@beep/store'
import { useDispatch, useSelector } from 'react-redux'
import { getUserState, useLoginMutation, userActions } from '@beep/user'

export function PageSigninFeature() {
  const dispatch = useDispatch<AppDispatch>()
  const location = useLocation()
  const [login, result] = useLoginMutation()
  const navigate = useNavigate()
  const [error, setError] = useState('')
  const { isAuthenticated } = useSelector(getUserState)
  const methods = useForm({
    mode: 'onChange',
  })

  const toForgetPassword = () => {
    navigate('/authentication/forgot-password')
  }

  const toSignup = () => {
    navigate('/authentication/signup')
  }

  const onSubmit = methods.handleSubmit((data) => {
    login(data as LoginRequest)
  })

  useEffect(() => {
    if (result?.isSuccess && result?.status === 'fulfilled') {
      dispatch(userActions.updateIsLoading(false))
      dispatch(userActions.setTokens(result.data.tokens))
    } else if (result?.isError) {
      setError('Email/password incorrect')
    }
  }, [result, dispatch])

  useEffect(() => {
    if (isAuthenticated) {
      const redirectTo = location.state?.from?.pathname || '/servers/discover'
      navigate(redirectTo, { replace: true })
    }
  }, [isAuthenticated, location.state?.from?.pathname, navigate])

  return (
    <FormProvider {...methods}>
      <PageSignin
        onSubmit={onSubmit}
        loading={result.isLoading}
        toSignup={toSignup}
        toForgetPassword={toForgetPassword}
        error={error}
      />
    </FormProvider>
  )
}
