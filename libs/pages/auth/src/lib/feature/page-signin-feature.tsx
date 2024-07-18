import { useEffect, useState } from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import { PageSignin } from '../ui/page-signin'
import { useNavigate } from 'react-router-dom'
import { LoginRequest } from '@beep/contracts'
import { AppDispatch } from '@beep/store'
import { useDispatch, useSelector } from 'react-redux'
import { getUserState, useLoginMutation, userActions } from '@beep/user'

export function PageSigninFeature() {
  const dispatch = useDispatch<AppDispatch>()
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
      sessionStorage.setItem('accessToken', result.data.tokens.accessToken)
      sessionStorage.setItem('refreshToken', result.data.tokens.refreshToken)
      dispatch(userActions.setTokens(result.data.tokens))
    } else if (result?.isError) {
      setError('Email/password incorrect')
    }
  }, [result, dispatch])

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/discover')
    }
  }, [isAuthenticated, navigate])

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
