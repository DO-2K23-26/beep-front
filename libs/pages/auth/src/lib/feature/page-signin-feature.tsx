import { useEffect, useState } from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import { PageSignin } from '../ui/page-signin'
import { useNavigate } from 'react-router-dom'
import { LoginRequest } from '@beep/contracts'
import { AppDispatch } from '@beep/store'
import { useDispatch, useSelector } from 'react-redux'
import { getUserState, useLoginMutation, userActions } from '@beep/user'
import {
  authenticationActions,
  useLazyGetGeneratedTokenQuery,
} from '@beep/authentication'
import { TransmitSingleton } from '@beep/transmit'
import toast from 'react-hot-toast'

export function PageSigninFeature() {
  const dispatch = useDispatch<AppDispatch>()
  const [login, loginResult] = useLoginMutation()
  const navigate = useNavigate()
  const [error, setError] = useState('')
  const { isAuthenticated } = useSelector(getUserState)
  const [generateToken, tokenResult] = useLazyGetGeneratedTokenQuery()
  const qrCodeFeatureFlag = true
  const [qrCodeLink, setQrCodeLink] = useState('')

  useEffect(() => {
    generateToken(null, true)
  }, [generateToken])

  useEffect(() => {
    if (!tokenResult.isLoading && tokenResult.data) {
      const newQrCodeLink = `${window.location.protocol}//${
        window.location.hostname
      }${window.location.port ? ':' : ''}${
        window.location.port
        }/authentication/qrcode/${tokenResult.data.token}`

      setQrCodeLink(newQrCodeLink)
      TransmitSingleton.subscribe(
        `qr-code/${tokenResult.data.token}`,
        (message) => {
          const data = JSON.parse(message)
          if (data.status === 'success') {
            dispatch(
              userActions.setTokens({
                accessToken: data.accessToken,
                refreshToken: data.refreshToken,
              })
            )
            toast.success(`Successfully logged in !`)
          }
        }
      )
      dispatch(authenticationActions.setQRCodeToken(tokenResult.data.token))
    }
    return () => {
      TransmitSingleton.unsubscribeChannel(
        `qr-code/${tokenResult?.data?.token}`
      )
    }
  }, [tokenResult, dispatch])

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
    if (loginResult?.isSuccess && loginResult?.status === 'fulfilled') {
      sessionStorage.setItem('accessToken', loginResult.data.tokens.accessToken)
      sessionStorage.setItem(
        'refreshToken',
        loginResult.data.tokens.refreshToken
      )
      dispatch(userActions.updateIsLoading(false))
      dispatch(userActions.setTokens(loginResult.data.tokens))
    } else if (loginResult?.isError) {
      setError('Email/password incorrect')
    }
  }, [loginResult, dispatch])

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/discover')
    }
  }, [isAuthenticated, navigate])

  return (
    <FormProvider {...methods}>
      <PageSignin
        onSubmit={onSubmit}
        loading={loginResult.isLoading}
        toSignup={toSignup}
        toForgetPassword={toForgetPassword}
        error={error}
        qrCodeFeatureFlag={qrCodeFeatureFlag}
        qrCodeLink={qrCodeLink}
      />
    </FormProvider>
  )
}
