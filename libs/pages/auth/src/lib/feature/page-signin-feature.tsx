import { useEffect, useState } from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import { useLocation, useNavigate } from 'react-router-dom'
import {
  HttpError,
  LoginRequest,
  LoginWithQRCodeRequest,
  backendUrl,
} from '@beep/contracts'
import { AppDispatch } from '@beep/store'
import { useDispatch, useSelector } from 'react-redux'
import { getUserState, useLoginMutation, userActions } from '@beep/user'
import {
  authenticationActions,
  useLazyGetGeneratedTokenQuery,
  useLoginWithQRCodeMutation,
} from '@beep/authentication'
import { TransmitSingleton } from '@beep/utils'
import toast from 'react-hot-toast'
import { Transmit } from '@adonisjs/transmit-client'
import { useTranslation } from 'react-i18next'
import { PageSignin } from '../ui/page-signin'

export function PageSigninFeature() {
  const { t } = useTranslation()
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
  const [userData, setUserData] = useState({
    email: '',
    password: '',
  })

  useEffect(() => {
    generateToken(null, true)
  }, [generateToken])

  // Use async/await to handle subscription
  const handleSubscription = async (token: string) => {
    const transmit = new Transmit({
      baseUrl: backendUrl,
      uidGenerator: () => Math.random().toString(36).substring(7),
    })

    const subscription = transmit.subscription(`qr-code/${token}`)
    await subscription.create() // Wait for the subscription to be created

    subscription.onMessage((passKey: string) => {
      loginWithQRCode({
        token: token,
        passKey: passKey,
      } as LoginWithQRCodeRequest)
      toast.success(t('auth.page-signin.success'))
    })

    if (subscription.isCreated) {
      const newQrCodeLink = `${window.location.protocol}//${
        window.location.hostname
      }${window.location.port ? ':' : ''}${
        window.location.port
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

  const onSubmit = methods.handleSubmit((data) => {
    login(data as LoginRequest)
    setUserData(data as LoginRequest)
  })

  useEffect(() => {
    if (loginResult?.isSuccess && loginResult?.status === 'fulfilled') {
      dispatch(userActions.updateIsLoading(false))
      dispatch(userActions.setTokens(loginResult.data.tokens))
    } else if (loginResult?.isError) {
      const error = loginResult.error as HttpError
      if (error.data.code === 'E_MISSING_TOTP_TOKEN') {
        navigate('/authentication/totp', {
          state: {
            from: location,
            email: userData.email,
            password: userData.password,
          },
        })
      } else {
        setError(t('auth.page-signin.error'))
      }
    }
  }, [loginResult, userData, dispatch, navigate, location, t])

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
      setError(t('auth.page-signin.error'))
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
        error={error}
        qrCodeFeatureFlag={qrCodeFeatureFlag}
        qrCodeLink={qrCodeLink} // Only pass qrCodeLink if subscribed
      />
    </FormProvider>
  )
}
