import { useEffect, useState } from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import { PageSignin } from '../ui/page-signin'
import { useLocation, useNavigate } from 'react-router-dom'
import { LoginRequest, LoginWithQRCodeRequest, backendUrl } from '@beep/contracts'
import { AppDispatch } from '@beep/store'
import { useDispatch, useSelector } from 'react-redux'
import { getUserState, useLoginMutation, userActions } from '@beep/user'
import {
  authenticationActions,
  useLazyGetGeneratedTokenQuery,
  useLoginWithQRCodeMutation,
} from '@beep/authentication'
import { TransmitSingleton } from '@beep/transmit'
import toast from 'react-hot-toast'
import { Transmit } from '@adonisjs/transmit-client'

export function PageSigninFeature() {
  const dispatch = useDispatch<AppDispatch>()
  const location = useLocation()
  const [login, loginResult] = useLoginMutation()
  const [loginWithQRCode, loginWithQRCodeResult] = useLoginWithQRCodeMutation()
  const navigate = useNavigate()
  const [error, setError] = useState('')
  const { isAuthenticated } = useSelector(getUserState)
  const [generateToken, tokenResult] = useLazyGetGeneratedTokenQuery()
  const qrCodeFeatureFlag = true
  const [qrCodeLink, setQrCodeLink] = useState('')

  useEffect(() => {
    generateToken(null, true)
  }, [generateToken])

  // Use async/await to handle subscription
  const handleSubscription = async (token: string) => {
    const transmit = new Transmit({
      baseUrl: backendUrl,
      uidGenerator: () => Math.random().toString(36).substring(7)
    })

    const subscription = transmit.subscription(`qr-code/${token}`)
    await subscription.create() // Wait for the subscription to be created

    subscription.onMessage((passKey: string) => {
      loginWithQRCode({token: token, passKey: passKey} as LoginWithQRCodeRequest)
      toast.success('Successfully logged in!')
    })

    if (subscription.isCreated) {
      const newQrCodeLink = `${window.location.protocol}//${window.location.hostname
        }${window.location.port ? ':' : ''}${window.location.port
        }/authentication/qrcode/${token}`

      setQrCodeLink(newQrCodeLink)
      dispatch(authenticationActions.setQRCodeToken(token))
    }
  }

  useEffect(() => {
    if (tokenResult.data) {
      handleSubscription(tokenResult.data.token)
    }

    // Clean up on unmount
    return () => {
      if (tokenResult?.data?.token) {
        TransmitSingleton.unsubscribeChannel(
          `qr-code/${tokenResult.data.token}`
        )
      }
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
      dispatch(userActions.updateIsLoading(false))
      dispatch(userActions.setTokens(loginResult.data.tokens))
    } else if (loginResult?.isError) {
      setError('Email/password incorrect')
    }
  }, [loginResult, dispatch])

  useEffect(() => {
    if (
      loginWithQRCodeResult?.isSuccess &&
      loginWithQRCodeResult?.status === 'fulfilled'
    ) {
      sessionStorage.setItem(
        'accessToken',
        loginWithQRCodeResult.data.tokens.accessToken
      )
      sessionStorage.setItem(
        'refreshToken',
        loginWithQRCodeResult.data.tokens.refreshToken
      )
      dispatch(userActions.updateIsLoading(false))
      dispatch(userActions.setTokens(loginWithQRCodeResult.data.tokens))
    } else if (loginWithQRCodeResult?.isError) {
      setError('Email/password incorrect')
    }
  }, [loginWithQRCodeResult, dispatch])

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
        loading={loginResult.isLoading}
        toSignup={toSignup}
        toForgetPassword={toForgetPassword}
        error={error}
        qrCodeFeatureFlag={qrCodeFeatureFlag}
        qrCodeLink={qrCodeLink} // Only pass qrCodeLink if subscribed
      />
    </FormProvider>
  )
}
