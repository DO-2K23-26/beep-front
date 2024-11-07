import { useEffect, useState, useRef } from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import { PageSignin } from '../ui/page-signin'
import { useNavigate } from 'react-router-dom'
import { LoginRequest } from '@beep/contracts'
import { AppDispatch } from '@beep/store'
import { useDispatch, useSelector } from 'react-redux'
import { getUserState, useLoginMutation, userActions } from '@beep/user'
import { authenticationActions, useGetGeneratedTokenMutation } from '@beep/authentication'
import { TransmitSingleton } from '@beep/transmit'

export function PageSigninFeature() {
  const dispatch = useDispatch<AppDispatch>()
  const [login, result] = useLoginMutation()
  const navigate = useNavigate()
  const [error, setError] = useState('')
  const { isAuthenticated } = useSelector(getUserState)
  const [getGeneratedToken] = useGetGeneratedTokenMutation()
  const qrCodeFeatureFlag = true
  const qrCodeLink = useRef("")

  useEffect(() => {
    getGeneratedToken(null)
      .unwrap()
      .then((data) => {
        qrCodeLink.current = `https://${window.location.hostname}${
          window.location.port ? ':' : ''
          }${window.location.port}/authentication/qrcode/${data.token}`
        dispatch(authenticationActions.setQRCodeToken(data.token))
      })
    return () => {
      qrCodeLink.current = ''
    }
  }, [getGeneratedToken, dispatch])



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
      dispatch(userActions.updateIsLoading(false))
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
        qrCodeFeatureFlag={qrCodeFeatureFlag}
        qrCodeLink={qrCodeLink.current}
      />
    </FormProvider>
  )
}
